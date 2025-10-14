'use client'

import { Album } from "@/models/album";
import { Drawer, Image } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { forwardRef, useImperativeHandle, useState } from "react";

export interface AlbumDetailDrawerRef {
    openDrawer: (album: Album) => void;
}

export interface AlbumDetailDrawerProps {
}

const AlbumDetailDrawer = forwardRef<AlbumDetailDrawerRef, AlbumDetailDrawerProps>((props, ref) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [album, setAlbum] = useState<Album | null>(null);

    useImperativeHandle(ref, () => ({
        openDrawer: openDrawer,
    }));

    function openDrawer(album: Album) {
        setAlbum(album);
        open();
    }

    return (
        <Drawer size="md" opened={opened} onClose={close} withCloseButton={false} position="right" padding="xl">
            <div className="flex flex-col overflow-y-auto">
                <Image className="self-center" radius="md" src={album?.coverUrl} w={250} h={250} alt={album?.title} />
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

                <div className="flex flex-col mt-4">
                    <p className="font-bold text-lg">Music List</p>
                </div>

            </div>
        </Drawer>
    )
});

AlbumDetailDrawer.displayName = 'AlbumDetailDrawer';

export default AlbumDetailDrawer;