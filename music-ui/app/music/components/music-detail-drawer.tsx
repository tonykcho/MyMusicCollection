'use client'

import { useMessage } from "@/components/message";
import { Music } from "@/models/music";
import MusicService from "@/services/music-service";
import { Drawer, Image, Switch } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { FaHeart, FaPen, FaTrashCan } from "react-icons/fa6";
import EditMusicDrawer, { EditMusicDrawerRef } from "./edit-music-drawer";

export interface MusicDetailDrawerRef {
    opened: boolean;
    openDrawer: (id: string, coverUrl?: string | null) => void;
}

export interface MusicDetailDrawerProps {
    onMusicEdited: () => void;
    onMusicDeleted: () => void;
}

const MusicDetailDrawer = forwardRef<MusicDetailDrawerRef, MusicDetailDrawerProps>((props, ref) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [musicId, setMusicId] = useState<string | null>(null);
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    const [music, setMusic] = useState<Music | null>(null);
    const { messageBoxOpened, confirm } = useMessage();

    const editMusicDrawerRef = React.useRef<EditMusicDrawerRef>(null);

    useImperativeHandle(ref, () => ({
        opened: opened,
        openDrawer: openDrawer,
    }));

    function openDrawer(id: string, coverUrl?: string | null) {
        setMusicId(id);
        setCoverUrl(coverUrl || null);
        open();
    }

    function closeDrawer() {
        if (editMusicDrawerRef.current?.opened) {
            return;
        }

        if (messageBoxOpened) {
            return;
        }

        close();
    }

    const query = useQuery({
        queryKey: ['album-detail', musicId],
        queryFn: async () => {
            if (!musicId) return null;
            const fetchedMusic = await MusicService.getMusicById(musicId);
            fetchedMusic.coverUrl = coverUrl;
            setMusic(fetchedMusic);
            return fetchedMusic;
        },
        enabled: !!musicId
    });

    async function onMusicDeleted(music: Music) {
        const confirmed = await confirm(`Are you sure you want to delete ${music.title}?`);
        if (confirmed) {
            await MusicService.deleteMusic(music.id);
            props.onMusicDeleted();
            close();
        }
    }

    async function toggleMusicAsFavorite(music: Music) {
        if (music.isFavorite == false) {
            await MusicService.setFavorite(music.id);
        }
        else {
            await MusicService.unsetFavorite(music.id);
        }
        props.onMusicEdited();
        query.refetch();
    }

    return (
        <>
            <Drawer size="md" opened={opened} onClose={closeDrawer} withCloseButton={false} position="right" padding="xl">
                <div className="flex flex-row items-center px-4 h-15 bg-red-400 fixed top-0 right-0 left-0">
                    <p className="text-white text-lg font-bold">{music?.title}</p>
                </div>
                <div className="flex flex-col h-full p-1 pt-10">
                    <Image className="self-center border" radius="md" src={music?.coverUrl} w={250} h={250} alt={music?.title} />
                    <div className="flex flex-row mt-4">
                        <p className="text-lg mt-2 flex-[0_0_140]">Title:</p>
                        <p className="text-lg mt-2 flex-1">{music?.title}</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="text-lg mt-2 flex-[0_0_140]">Artist:</p>
                        <p className="text-lg mt-2 flex-1">{music?.artist}</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="text-lg mt-2 flex-[0_0_140]">Release Date:</p>
                        <p className="text-lg mt-2 flex-1">{music?.getDateString()}</p>
                    </div>

                    <div className="flex-1"></div>


                    <div className="flex items-center mt-4">
                        <button onClick={() => onMusicDeleted(music!)} className=" action-button bg-red-400 text-white hover:scale-105 hover:bg-red-500 transition-colors" title="Delete Music">
                            <FaTrashCan size={20} />
                        </button>

                        <div className="flex-1"></div>

                        <Switch
                            className="me-6 scale-125"
                            checked={music?.isFavorite}
                            onChange={async () => { await toggleMusicAsFavorite(music!); }}
                            size="xl"
                            color="pink"
                            thumbIcon={music?.isFavorite ? <FaHeart fill="red" size={12} /> : <FaHeart fill="red" size={12} />}
                        ></Switch>


                        <button onClick={() => editMusicDrawerRef.current?.openDrawer(music!)} className="action-button bg-amber-400 text-white hover:scale-105 hover:bg-amber-500 transition-colors" title="Edit Album">
                            <FaPen size={20} />
                        </button>
                    </div>
                </div>
            </Drawer>

            <EditMusicDrawer ref={editMusicDrawerRef} onMusicEdited={() => { props.onMusicEdited(); query.refetch() }} />
        </>
    )
});

MusicDetailDrawer.displayName = 'MusicDetailDrawer';

export default MusicDetailDrawer;