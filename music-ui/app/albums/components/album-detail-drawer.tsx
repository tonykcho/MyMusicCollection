'use client'

import { Album } from "@/models/album";
import AlbumService from "@/services/album-service";
import { Drawer, Image } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { forwardRef, useImperativeHandle, useState } from "react";
import React from "react";
import CreateMusicDrawer, { CreateMusicDrawerRef } from "@/app/music/components/create-music-drawer";
import { FaTrashCan, FaPlus } from "react-icons/fa6"
import { useMessage } from "@/components/message";

export interface AlbumDetailDrawerRef {
    openDrawer: (id: string, coverUrl?: string | null) => void;
}

export interface AlbumDetailDrawerProps {
    onAlbumDeleted: () => void
}

const AlbumDetailDrawer = forwardRef<AlbumDetailDrawerRef, AlbumDetailDrawerProps>((props, ref) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [albumId, setAlbumId] = useState<string | null>(null);
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    const [album, setAlbum] = useState<Album | null>(null);
    const { confirm } = useMessage();

    const createMusicDrawerRef = React.useRef<CreateMusicDrawerRef>(null);

    useImperativeHandle(ref, () => ({
        openDrawer: openDrawer,
    }));

    function openDrawer(id: string, coverUrl?: string | null) {
        setAlbumId(id);
        setCoverUrl(coverUrl || null);
        open();
    }

    function closeDrawer() {
        if (createMusicDrawerRef.current?.opened) {
            return;
        }

        close();
    }

    async function onAlbumDeleted() {
        const confirmed = await confirm("Are you sure you want to delete this album?");
        if (confirmed) {
            await AlbumService.deleteAlbum(albumId!);
            props.onAlbumDeleted();
            closeDrawer();
        }
    }

    const query = useQuery({
        queryKey: ['album-detail', albumId],
        queryFn: async () => {
            if (!albumId) return null;
            const fetchedAlbum = await AlbumService.getAlbumById(albumId);
            fetchedAlbum.coverUrl = coverUrl;
            setAlbum(fetchedAlbum);
            return fetchedAlbum;
        },
        enabled: !!albumId
    });

    return (
        <>
            <Drawer size="md" opened={opened} onClose={closeDrawer} withCloseButton={false} position="right" padding="xl">
                <div className="flex flex-col h-full p-1">
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

                    <div className="flex flex-row items-center mt-2">
                        <p className="font-bold text-lg">Music List</p>
                    </div>

                    <div className="flex-1 flex flex-col overflow-y-auto mt-2 rounded-lg">
                        <div className="flex-1 flex flex-col ">
                            {album?.musics.map((music, index) => (
                                <div key={music.id} className="flex flex-row items-center hover:bg-gray-100 mt-2 py-1 rounded-md">
                                    <p className="text-md flex-[0_0_30]">{index + 1}.</p>
                                    <p className="text-md flex-1">{music.title}</p>
                                    <p className="text-md flex-[0_0_100] text-right">{music.releaseDate.getFullYear()}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <button onClick={() => onAlbumDeleted()} className="action-button bg-red-400 text-white hover:scale-105 hover:bg-red-500 transition-colors" title="Delete Album">
                            <FaTrashCan size={20} />
                        </button>
                        <button onClick={() => createMusicDrawerRef.current?.openDrawer(album)} className="action-button bg-purple-400 text-white hover:scale-105 hover:bg-purple-500 transition-colors">
                            <FaPlus size={20} />
                        </button>
                    </div>
                </div>
            </Drawer>

            <CreateMusicDrawer ref={createMusicDrawerRef} onMusicCreated={() => { query.refetch(); }} />
        </>
    )
});

AlbumDetailDrawer.displayName = 'AlbumDetailDrawer';

export default AlbumDetailDrawer;