'use client';

import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Albums() {

    const albumsQuery = useQuery({
        queryKey: ['albums'],
        queryFn: async () => {
            const res = await fetch('https://localhost:7279/api/albums');
            return res.json();
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
        <div className='flex flex-row flex-wrap overflow-y-auto p-2'>
            {albumsQuery.data.map((album: any) => (
                <div className="p-1 w-1/5 h-60 p-2 flex flex-col hover:scale-105 transition-transform" key={album.id}>
                    <div className="p-4 flex-1 border rounded-lg shadow-md">
                        <p className="text-lg font-semibold">{album.title}</p>
                        <p className="text-sm text-gray-600">Artist: {album.artist}</p>
                        <p className="text-sm text-gray-600">Year: {album.year}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}