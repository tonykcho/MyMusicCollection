'use client'

import { Album } from "@/models/album";
import AlbumService from "@/services/album-service";
import { Drawer, Image, Switch } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { forwardRef, useImperativeHandle, useState } from "react";
import React from "react";
import CreateMusicDrawer, { CreateMusicDrawerRef } from "@/app/music/components/create-music-drawer";
import { FaTrashCan, FaPlus, FaPen, FaHeart } from "react-icons/fa6"
import { useMessage } from "@/components/message";
import MusicService from "@/services/music-service";
import { Music } from "@/models/music";
import EditAlbumDrawer, { EditAlbumDrawerRef } from "./edit-album-drawer";
import MusicDetailDrawer, { MusicDetailDrawerRef } from "@/app/music/components/music-detail-drawer";
import { useErrorMessage } from "@/components/error-message";

export interface AlbumDetailDrawerRef
{
    openDrawer: (id: string, coverUrl?: string | null) => void;
}

export interface AlbumDetailDrawerProps
{
    onAlbumEdited: () => void;
    onAlbumDeleted: () => void;
}

const AlbumDetailDrawer = forwardRef<AlbumDetailDrawerRef, AlbumDetailDrawerProps>((props, ref) =>
{
    const [opened, { open, close }] = useDisclosure(false);
    const [albumId, setAlbumId] = useState<string | null>(null);
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    const [album, setAlbum] = useState<Album | null>(null);
    const { confirm, messageBoxOpened } = useMessage();
    const { showErrorMessage } = useErrorMessage();

    const createMusicDrawerRef = React.useRef<CreateMusicDrawerRef>(null);
    const editAlbumDrawerRef = React.useRef<EditAlbumDrawerRef>(null);
    const musicDetailDrawerRef = React.useRef<MusicDetailDrawerRef>(null);

    const { mutate: deleteAlbum } = useMutation({
        mutationFn: (id: string) => AlbumService.deleteAlbum(id),
        onSuccess: () =>
        {
            props.onAlbumDeleted();
            close();
        },
        onError: (error) =>
        {
            showErrorMessage(error.message);
        }
    });

    const { mutate: deleteMusic } = useMutation({
        mutationFn: (id: string) => MusicService.deleteMusic(id),
        onSuccess: () =>
        {
            query.refetch();
        },
        onError: (error) =>
        {
            showErrorMessage(error.message);
        }
    });

    useImperativeHandle(ref, () => ({
        openDrawer: openDrawer,
    }));

    function openDrawer(id: string, coverUrl?: string | null)
    {
        setAlbumId(id);
        setCoverUrl(coverUrl || null);
        open();
    }

    function closeDrawer()
    {
        if (createMusicDrawerRef.current?.opened)
        {
            return;
        }

        if (musicDetailDrawerRef.current?.opened)
        {
            return;
        }

        if (editAlbumDrawerRef.current?.opened)
        {
            return;
        }

        if (messageBoxOpened)
        {
            return;
        }

        close();
    }

    async function onAlbumDeleted(album: Album)
    {
        const confirmed = await confirm(`Are you sure you want to delete ${album.title}?`);
        if (confirmed)
        {
            deleteAlbum(album.id);
        }
    }

    async function onMusicDeleted(music: Music)
    {
        const confirmed = await confirm(`Are you sure you want to delete ${music.title}?`);
        if (confirmed)
        {
            deleteMusic(music.id);
        }
    }

    const query = useQuery({
        queryKey: ['album-detail', albumId],
        queryFn: async () =>
        {
            if (!albumId) return null;
            const fetchedAlbum = await AlbumService.getAlbumById(albumId);
            fetchedAlbum.coverUrl = coverUrl;
            setAlbum(fetchedAlbum);
            return fetchedAlbum;
        },
        enabled: !!albumId
    });

    function renderAlbumDetail()
    {
        return (
            <>
                <div className="flex-2 flex flex-col h-full p-2">
                    <Image className="self-center border" radius="md" src={album?.coverUrl} w={250} h={250} alt={album?.title} />
                    <div className="flex flex-row mt-4">
                        <p className="text-lg mt-2 flex-[0_0_140]">Title:</p>
                        <p className="text-lg mt-2 flex-1">{album?.title}</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="text-lg mt-2 flex-[0_0_140]">Artist:</p>
                        <p className="text-lg mt-2 flex-1">{album?.artist}</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="text-lg mt-2 flex-[0_0_140]">Release Date:</p>
                        <p className="text-lg mt-2 flex-1">{album?.getDateString()}</p>
                    </div>

                    <div className="flex-1"></div>

                    <div className="flex items-center justify-between mt-4">
                        <button onClick={() => onAlbumDeleted(album!)} className="action-button bg-red-400 text-white hover:scale-105 hover:bg-red-500 transition-colors" title="Delete Album">
                            <FaTrashCan size={20} />
                        </button>

                        <button onClick={() => editAlbumDrawerRef.current?.openDrawer(album!)} className="action-button bg-amber-400 text-white hover:scale-105 hover:bg-amber-500 transition-colors" title="Edit Album">
                            <FaPen size={20} />
                        </button>
                    </div>
                </div>
            </>
        )
    }

    function renderMusicList()
    {
        return (
            <>
                <div className="flex-3 flex flex-col p-2">
                    <div className="flex flex-row items-center justify-between pe-4 pb-2 border-b border-gray-300">
                        <p className="font-bold text-lg">Music List</p>
                        <button onClick={() => createMusicDrawerRef.current?.openDrawer(album)} className="action-button-sm bg-purple-400 text-white hover:scale-105 hover:bg-purple-500 transition-colors">
                            <FaPlus size={12} />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col overflow-y-auto mt-2 rounded-lg">
                        <div className="flex-1 flex flex-col ">
                            {album?.musics.map((music, index) => (
                                <div onClick={() => musicDetailDrawerRef.current?.openDrawer(music.id, album.coverUrl)} key={music.id} className="flex flex-row items-center hover:bg-gray-100 mt-2 py-1 ps-2 pe-4 rounded-md">
                                    <p className="text-sm flex-[0_0_30]">{index + 1}.</p>
                                    <p className="text-sm flex-1 text-overflow-ellipsis">{music.title}</p>
                                    <p className="text-sm flex-[0_0_100] text-right">{music.releaseDate.getFullYear()}</p>
                                    <Switch
                                        className="ml-4"
                                        checked={music?.isFavorite}
                                        size="md"
                                        color="pink"
                                        thumbIcon={music?.isFavorite ? <FaHeart fill="red" size={12} /> : <FaHeart fill="red" size={12} />}
                                    ></Switch>
                                    <button onClick={(e) => { e.stopPropagation(); onMusicDeleted(music) }} className="action-button-sm bg-red-400 text-white hover:scale-105 hover:bg-red-500 transition-colors ml-2" title="Delete Music">
                                        <FaTrashCan size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <Drawer size="60%" opened={opened} onClose={closeDrawer} withCloseButton={false} position="right" padding="xl">
                <div className="flex flex-row items-center px-4 h-15 bg-red-400 fixed top-0 right-0 left-0">
                    <p className="text-white text-lg font-bold">{album?.title}</p>
                </div>
                <div className="flex flex-row h-full pt-10">
                    {renderAlbumDetail()}
                    {renderMusicList()}
                </div>
            </Drawer>

            <CreateMusicDrawer ref={createMusicDrawerRef} onMusicCreated={() => { query.refetch(); }} />
            <EditAlbumDrawer
                ref={editAlbumDrawerRef}
                onAlbumEdited={() => { query.refetch(); props.onAlbumEdited(); }} />
            <MusicDetailDrawer
                ref={musicDetailDrawerRef}
                onMusicDeleted={() => { query.refetch(); }}
                onMusicEdited={() => { query.refetch(); }} />
        </>
    )
});

AlbumDetailDrawer.displayName = 'AlbumDetailDrawer';

export default AlbumDetailDrawer;