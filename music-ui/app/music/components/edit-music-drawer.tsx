'use client'

import { Music } from "@/models/music";
import MusicService from "@/services/music-service";
import { Drawer, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { forwardRef, useImperativeHandle } from "react";

export interface EditMusicDrawerRef {
    opened: boolean;
    openDrawer: (music: Music) => void;
}

export interface EditMusicDrawerProps {
    onMusicEdited: () => void;
}

const EditMusicDrawer = forwardRef<EditMusicDrawerRef, EditMusicDrawerProps>((props, ref) => {
    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm({
        initialValues: {
            id: '',
            title: '',
            artist: '',
            releaseDate: null as string | null
        },
        validate: {
            title: (value) => (value ? null : 'Title is required'),
            artist: (value) => (value ? null : 'Artist is required'),
            releaseDate: (value) => (value ? null : 'Release Date is required'),
        }
    });

    useImperativeHandle(ref, () => ({
        opened: opened,
        openDrawer: openDrawer,
    }));

    function openDrawer(music: Music) {
        form.setValues({
            id: music.id,
            title: music.title,
            artist: music.artist,
            releaseDate: music.releaseDate.toISOString(),
        });
        open();
    }

    async function onSave(values: typeof form.values) {
        const musicData = {
            title: values.title,
            artist: values.artist,
            releaseDate: values.releaseDate ?? '',
        };

        await MusicService.updateMusic(values.id, musicData);
        form.reset();
        props.onMusicEdited();
        close();
    }

    return (
        <Drawer size="md" opened={opened} onClose={close} withCloseButton={false} position="right" padding="xl">
            <form onSubmit={form.onSubmit(onSave)} className="flex flex-col h-full">
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

                <button type="submit" className="mt-3 bg-purple-400 text-white p-2 rounded hover:bg-purple-500 transition-colors active:scale-95 transition-transform">Save</button>
            </form >
        </Drawer>
    );
});

EditMusicDrawer.displayName = 'EditMusicDrawer';

export default EditMusicDrawer;