'use client';

import { Album } from "@/models/album";
import AlbumService from "@/services/album-service";
import { BackgroundImage, Drawer, FileInput, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useQueries, useQuery } from "@tanstack/react-query";
import React from "react";

export default function Albums() {
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

    const albumsQuery = useQuery({
        queryKey: ['albums'],
        queryFn: async () => {
            return AlbumService.getAlbums();
        }
    })

    const albums: Album[] = albumsQuery.data ?? [];

    const coverQueries = useQueries({
        queries: albums.filter(album => album.id == '32bc2977-5399-4a0f-9e47-dd705de37ad0').map((album) => ({
            queryKey: ['albumCover', album.id],
            queryFn: async () => {
                var cover = await AlbumService.getAlbumCover(album.id);
                // make a url for the blob
                if (cover) {
                    album.coverUrl = URL.createObjectURL(cover);
                }

                return cover;
            },
            enabled: !!album.id,
        }))
    })

    function submitAlbum(values: typeof form.values) {
        console.log(form.values)
        const albumData = {
            title: values.title,
            artist: values.artist,
            releaseDate: values.releaseDate ?? '',
            coverImage: values.coverImage ?? undefined,
        };

        AlbumService.createAlbum(albumData)
            .then(() => {
                form.reset();
                close();
                albumsQuery.refetch();
            })
            .catch((error) => {
                console.error('Error creating album:', error);
            });
    }

    function RenderAlbum(album: Album) {
        return (<div className="p-1 w-1/5 h-60 p-2 flex flex-col cursor-pointer hover:scale-105 transition-transform" key={album.id}>
            <div style={{ backgroundImage: album.coverUrl != null ? `url(${album.coverUrl})` : undefined, backgroundSize: 'cover' }} className="p-4 flex flex-col flex-1 border rounded-lg shadow-md hover:bg-gray-100 flex flex-col">
                <div className="flex-1"></div>
                <div className="flex items-end">
                    <div className="flex-1 flex flex-col">
                        <p className="text-sm text-gray-600">Artist: {album.artist}</p>
                        <p className="text-sm text-gray-600">Year: {album.releaseDate.getFullYear()}</p>
                    </div>
                    <p className="text-lg font-semibold">{album.title}</p>
                </div>
            </div>
        </div>);
    }

    if (albumsQuery.isLoading) {
        return (
            <div className='flex flex-col items-center justify-center flex-1'>
                <p className='text-xl'>Loading...</p>
            </div>
        );
    }

    if (albumsQuery.isError) {
        return (
            <div className='flex flex-col items-center justify-center flex-1'>
                <p className='text-xl'>Error loading albums</p>
            </div>
        );
    }

    return (
        <>
            <div className='flex flex-row flex-wrap overflow-y-auto p-2'>
                {albumsQuery.data?.map((album: Album) => (
                    RenderAlbum(album)
                ))}
                <button onClick={() => { form.reset(); open() }} className="flex items-center justify-center fixed bottom-8 right-8 bg-purple-400 w-12 h-12 text-white p-4 rounded-full shadow-lg cursor-pointer hover:scale-105 hover:bg-purple-500 transition-colors">
                    <p className="text-xl">+</p>
                </button>
            </div>

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
        </>
    );
}