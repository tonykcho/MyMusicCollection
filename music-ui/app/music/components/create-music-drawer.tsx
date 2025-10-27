'use client'

import { useErrorMessage } from "@/components/error-message";
import { Album } from "@/models/album";
import { CreateMusicDto } from "@/models/music";
import MusicService from "@/services/music-service";
import { Drawer, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { forwardRef, useImperativeHandle } from "react";

export interface CreateMusicDrawerRef
{
    opened: boolean;
    openDrawer: (album?: Album | null) => void;
}

export interface CreateMusicDrawerProps
{
    onMusicCreated: () => void
}

const CreateMusicDrawer = forwardRef<CreateMusicDrawerRef, CreateMusicDrawerProps>((props, ref) =>
{
    const [opened, { open, close }] = useDisclosure(false);
    const { showErrorMessage } = useErrorMessage();

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

    const { mutate: createMusic } = useMutation({
        mutationFn: (musicData: CreateMusicDto) => MusicService.createMusic(musicData),
        onSuccess: () =>
        {
            form.reset();
            props.onMusicCreated();
            close();
        },
        onError: (error) =>
        {
            showErrorMessage(error.message);
        }
    })

    useImperativeHandle(ref, () => ({
        opened: opened,
        openDrawer: openDrawer,
    }));

    function openDrawer(album?: Album | null)
    {
        form.reset();

        if (album != null)
        {
            form.setFieldValue('artist', album.artist);
            form.setFieldValue('releaseDate', album.releaseDate.toISOString());
            form.setFieldValue('albumId', album.id);
        }

        open();
    }

    async function submitMusic(values: typeof form.values)
    {
        const musicData: CreateMusicDto = {
            title: values.title,
            artist: values.artist,
            releaseDate: values.releaseDate ?? '',
            albumId: values.albumId ?? null,
        };

        createMusic(musicData);
    }

    return (
        <Drawer size="md" opened={opened} onClose={close} withCloseButton={false} position="right" padding="xl">
            <div className="flex flex-row items-center px-4 h-15 bg-amber-500 fixed top-0 right-0 left-0">
                <p className="text-white text-lg font-bold">Create Music</p>
            </div>
            <form onSubmit={form.onSubmit(submitMusic)} className="flex flex-col h-full pt-10">
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