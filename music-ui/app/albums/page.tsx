'use client';

import { Album } from "@/models/album";
import AlbumService from "@/services/album-service";
import { useQueries, useQuery } from "@tanstack/react-query";
import React from "react";
import CreateAlbumDrawer, { CreateAlbumDrawerRef } from "./components/create-album-drawer";
import AlbumDetailDrawer, { AlbumDetailDrawerRef } from "./components/album-detail-drawer";

export default function Albums() {
    const [coverUrls, setCoverUrls] = React.useState<{ [key: string]: string }>({});
    const createAlbumDrawerRef = React.useRef<CreateAlbumDrawerRef>(null);
    const albumDetailDrawerRef = React.useRef<AlbumDetailDrawerRef>(null);

    const albumsQuery = useQuery({
        queryKey: ['albums'],
        queryFn: async () => {
            return AlbumService.getAlbums();
        }
    })

    const albums: Album[] = albumsQuery.data ?? [];

    useQueries({
        queries: albums.filter(album => album.hasCoverImage).map((album) => ({
            queryKey: ['albumCover', album.id],
            queryFn: async () => {
                const cover = await AlbumService.getAlbumCover(album.id);
                // make a url for the blob
                if (cover) {
                    setCoverUrls(prev => ({ ...prev, [album.id]: URL.createObjectURL(cover) }));
                }

                return cover;
            },
            enabled: !!album.id,
        }))
    })

    function RenderAlbum(album: Album) {
        const coverUrl = coverUrls[album.id];
        album.coverUrl = coverUrl;
        return (<div className="p-1 w-1/5 h-68 p-2 flex flex-col cursor-pointer hover:scale-105 transition-transform" key={album.id}>
            <div onClick={() => albumDetailDrawerRef.current?.openDrawer(album)} style={{ backgroundImage: album.coverUrl != null ? `url(${album.coverUrl})` : undefined, backgroundSize: 'cover' }} className="p-4 flex flex-col flex-1 border rounded-lg shadow-md hover:bg-gray-100 flex flex-col">
                <div className="flex-1"></div>
                <div className="flex items-end">
                    <div className="flex-1 flex flex-col">
                        <p className="text-sm text-gray-600">{album.artist}</p>
                        <p className="text-sm text-gray-600">{album.releaseDate.getFullYear()}</p>
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
                <button onClick={() => createAlbumDrawerRef.current?.openDrawer()} className="flex items-center justify-center fixed bottom-8 right-8 bg-purple-400 w-12 h-12 text-white p-4 rounded-full shadow-lg cursor-pointer hover:scale-105 hover:bg-purple-500 transition-colors">
                    <p className="text-xl">+</p>
                </button>
            </div>

            <CreateAlbumDrawer ref={createAlbumDrawerRef} onAlbumCreated={() => { albumsQuery.refetch(); }} />

            <AlbumDetailDrawer ref={albumDetailDrawerRef} />
        </>
    );
}