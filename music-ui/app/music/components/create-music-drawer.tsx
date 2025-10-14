'use client'

import { Album } from "@/models/album";
import { CreateMusicDto } from "@/models/music";
import MusicService from "@/services/music-service";
import { Drawer, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { forwardRef, useImperativeHandle } from "react";

export interface CreateMusicDrawerRef {
    openDrawer: (album?: Album | null) => void;
}

export interface CreateMusicDrawerProps {
    onMusicCreated: () => void
}

const CreateMusicDrawer = forwardRef<CreateMusicDrawerRef, CreateMusicDrawerProps>((props, ref) => {
    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm({
        initialValues: {
            title: '',
            artist: '',
            releaseDate: null as string | null,
            albumId: null as string | null,
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

    function openDrawer(album?: Album | null) {
        form.reset();

        if (album != null) {
            form.setFieldValue('artist', album.artist);
            form.setFieldValue('releaseDate', album.releaseDate.toDateString());
            form.setFieldValue('albumId', album.id);
        }

        open();
    }

    function submitMusic(values: typeof form.values) {
        const musicData: CreateMusicDto = {
            title: values.title,
            artist: values.artist,
            releaseDate: values.releaseDate ?? '',
            albumId: values.albumId ?? null,
        };

        MusicService.createMusic(musicData)
            .then(() => {
                form.reset();
                props.onMusicCreated();
                close();
            })
            .catch((error) => {
                console.error('Error creating music:', error);
            });
    }

    return (
        <Drawer size="md" opened={opened} onClose={close} withCloseButton={false} position="right" padding="xl">
            <form onSubmit={form.onSubmit(submitMusic)} className="flex flex-col h-full">
                <TextInput
                    label="Title"
                    placeholder="Enter music title"
                    {...form.getInputProps('title')}
                    className="mb-3"
                />
                <TextInput
                    label="Artist"
                    placeholder="Enter artist name"
                    {...form.getInputProps('artist')}
                    className="mb-3"
                />
                <DatePickerInput
                    label="Release Date"
                    placeholder="Select release date"
                    {...form.getInputProps('releaseDate')}
                    className="mb-3"
                />

                <button type="submit" className="mt-3 bg-purple-400 text-white p-2 rounded hover:bg-purple-500 transition-colors active:scale-95 transition-transform">Add Music</button>
            </form >
        </Drawer>
    );
});

CreateMusicDrawer.displayName = 'CreateMusicDrawer';

export default CreateMusicDrawer;