'use client';

import { Album, AlbumDto } from "@/models/album";
import { Drawer, TextInput } from "@mantine/core";
import { DatePicker, DatePickerInput, DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";

export default function Albums() {
    const [opened, { open, close }] = useDisclosure(false);
    const form = useForm({
        initialValues: {
            title: '',
            artist: '',
            releaseDate: null,
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
            const res = await fetch('https://localhost:7279/api/albums');
            const albumDtos: AlbumDto[] = await res.json();
            return albumDtos.map(dto => new Album(dto));
        }
    })

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
                    <div className="p-1 w-1/5 h-60 p-2 flex flex-col cursor-pointer hover:scale-105 transition-transform" key={album.id}>
                        <div className="p-4 flex-1 border rounded-lg shadow-md hover:bg-gray-100 flex flex-col">
                            <p className="text-lg font-semibold">{album.title}</p>
                            <p className="text-sm text-gray-600">Artist: {album.artist}</p>
                            <p className="text-sm text-gray-600">Year: {album.releaseDate.getFullYear()}</p>
                        </div>
                    </div>
                ))}
                <button onClick={open} className="flex items-center justify-center fixed bottom-8 right-8 bg-purple-400 w-12 h-12 text-white p-4 rounded-full shadow-lg cursor-pointer hover:scale-105 hover:bg-purple-500 transition-colors">
                    <p className="text-xl">+</p>
                </button>
            </div>

            <Drawer size="md" opened={opened} onClose={close} withCloseButton={false} position="right" padding="xl">
                <form onSubmit={form.onSubmit(console.log)} className="flex flex-col h-full">
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
                    <button type="submit" className="mt-3 bg-purple-400 text-white p-2 rounded hover:bg-purple-500 transition-colors active:scale-95 transition-transform">Add Album</button>
                </form>
            </Drawer>
        </>
    );
}