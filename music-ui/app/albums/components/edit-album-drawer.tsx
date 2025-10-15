'use client'

import { Album } from "@/models/album";
import AlbumService from "@/services/album-service";
import { Drawer, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { forwardRef, useImperativeHandle } from "react";

export interface EditAlbumDrawerRef {
    openDrawer: (album: Album) => void;
}

export interface EditAlbumDrawerProps {
    onAlbumEdited: () => void;
}

const EditAlbumDrawer = forwardRef<EditAlbumDrawerRef, EditAlbumDrawerProps>((props, ref) => {
    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm({
        initialValues: {
            id: '',
            title: '',
            artist: '',
            releaseDate: null as string | null,
        },

        validate: {
            title: (value) => (value ? null : 'Title is required'),
            artist: (value) => (value ? null : 'Artist is required'),
            releaseDate: (value) => (value ? null : 'Release Date is required'),
        }
    })

    useImperativeHandle(ref, () => ({
        openDrawer: openDrawer,
    }));

    function openDrawer(album: Album) {
        form.setValues({
            id: album.id,
            title: album.title,
            artist: album.artist,
            releaseDate: album.releaseDate.toISOString(),
        });
        open();
    }

    async function onSave(values: typeof form.values) {
        const albumData = {
            title: values.title,
            artist: values.artist,
            releaseDate: values.releaseDate ?? '',
        };

        await AlbumService.updateAlbum(values.id, albumData);
        form.reset();
        props.onAlbumEdited();
        close();
    }

    return (
        <>
            <Drawer size="md" opened={opened} onClose={close} withCloseButton={false} position="right" padding="xl">
                <form onSubmit={form.onSubmit(onSave)} className="flex flex-col h-full">
                    <TextInput
                        className="mb-3"
                        label="Title"
                        placeholder="Album Title"
                        key={form.key('title')}
                        {...form.getInputProps('title')}
                    />
                    <TextInput
                        className="mb-3"
                        label="Artist"
                        placeholder="Album Artist"
                        key={form.key('artist')}
                        {...form.getInputProps('artist')}
                    />
                    <DatePickerInput
                        className="mb-3"
                        label="Release Date"
                        placeholder="Album Release Date"
                        key={form.key('releaseDate')}
                        {...form.getInputProps('releaseDate')}
                    />
                    <button type="submit" className="mt-3 bg-purple-400 text-white p-2 rounded hover:bg-purple-500 transition-colors active:scale-95 transition-transform">Save</button>
                </form>
            </Drawer>
        </>
    )
});

EditAlbumDrawer.displayName = 'EditAlbumDrawer';

export default EditAlbumDrawer;
