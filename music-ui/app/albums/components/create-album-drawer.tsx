'use client'

import AlbumService from "@/services/album-service";
import { Drawer, FileInput, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { forwardRef, useImperativeHandle } from "react";

export interface CreateAlbumDrawerRef {
    openDrawer: () => void;
}

export interface CreateAlbumDrawerProps {
    onAlbumCreated: () => void
}

const CreateAlbumDrawer = forwardRef<CreateAlbumDrawerRef, CreateAlbumDrawerProps>((props, ref) => {
    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm({
        initialValues: {
            title: '',
            artist: '',
            releaseDate: null as string | null,
            coverImage: null as File | null,
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

    function openDrawer() {
        form.reset();
        open();
    }

    function submitAlbum(values: typeof form.values) {
        const albumData = {
            title: values.title,
            artist: values.artist,
            releaseDate: values.releaseDate ?? '',
            coverImage: values.coverImage ?? undefined,
        };

        AlbumService.createAlbum(albumData)
            .then(() => {
                form.reset();
                props.onAlbumCreated();
                close();
            })
            .catch((error) => {
                console.error('Error creating album:', error);
            });
    }

    return (
        <Drawer size="md" opened={opened} onClose={close} withCloseButton={false} position="right" padding="xl">
            <form onSubmit={form.onSubmit(submitAlbum)} className="flex flex-col h-full">
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
                <FileInput
                    className="mb-3"
                    label="Cover Image"
                    placeholder="Upload Cover Image"
                    key={form.key('coverImage')}
                    {...form.getInputProps('coverImage')}
                />
                <button type="submit" className="mt-3 bg-purple-400 text-white p-2 rounded hover:bg-purple-500 transition-colors active:scale-95 transition-transform">Add Album</button>
            </form>
        </Drawer>
    )
});

CreateAlbumDrawer.displayName = 'CreateAlbumDrawer';

export default CreateAlbumDrawer;