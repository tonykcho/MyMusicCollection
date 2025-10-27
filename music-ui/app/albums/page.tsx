'use client';

import { Album } from "@/models/album";
import AlbumService from "@/services/album-service";
import { useInfiniteQuery, useQueries } from "@tanstack/react-query";
import React, { useEffect } from "react";
import CreateAlbumDrawer, { CreateAlbumDrawerRef } from "./components/create-album-drawer";
import AlbumDetailDrawer, { AlbumDetailDrawerRef } from "./components/album-detail-drawer";
import { FaPlus } from "react-icons/fa6";
import { Badge } from "@mantine/core";

const PAGE_SIZE = 20;

export default function Albums()
{
    const [coverUrls, setCoverUrls] = React.useState<{ [key: string]: string }>({});
    const createAlbumDrawerRef = React.useRef<CreateAlbumDrawerRef>(null);
    const albumDetailDrawerRef = React.useRef<AlbumDetailDrawerRef>(null);

    const albumsQuery = useInfiniteQuery({
        queryKey: ['albums'],
        queryFn: async ({ pageParam = 0 }) =>
        {
            const albums = await AlbumService.getAlbums(pageParam * PAGE_SIZE, PAGE_SIZE);
            return albums;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
        {
            if (lastPage.length === 0)
            {
                return undefined; // No more pages
            }
            return allPages.length; // Next page index
        }
    })

    const loaderRef = React.useRef<HTMLDivElement>(null);
    useEffect(() =>
    {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver((entries) =>
        {
            if (entries[0].isIntersecting)
            {
                albumsQuery.fetchNextPage();
            }
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 1.0
        });

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [albumsQuery]);

    const albums: Album[] = albumsQuery.data?.pages.flatMap(page => page) || [];

    useQueries({
        queries: albums.filter(album => album.hasCoverImage).map((album) => ({
            queryKey: ['albumCover', album.id],
            queryFn: async () =>
            {
                const cover = await AlbumService.getAlbumCover(album.id);
                // make a url for the blob
                if (cover)
                {
                    setCoverUrls(prev => ({ ...prev, [album.id]: URL.createObjectURL(cover) }));
                }

                return cover;
            },
            enabled: !!album.id,
        }))
    })

    function RenderAlbum(album: Album)
    {
        const coverUrl = coverUrls[album.id];
        album.coverUrl = coverUrl;
        return (
            <div className="flex flex-col items-center" key={album.id}>
                <div className="w-60 h-60 p-2 flex flex-col cursor-pointer hover:scale-105 transition-transform">
                    <div
                        onClick={() => albumDetailDrawerRef.current?.openDrawer(album.id, album.coverUrl)}
                        style={{ backgroundImage: album.coverUrl != null ? `url(${album.coverUrl})` : undefined, backgroundSize: 'cover' }}
                        className="relative p-4 flex flex-col flex-1 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 flex flex-col">
                        <Badge size="xs" color="gray" className="absolute top-2 left-2">{album.releaseDate.getFullYear()}</Badge>
                        <Badge autoContrast size="xs" color="lime" className="absolute left-2 bottom-8">{album.artist}</Badge>
                        <Badge autoContrast size="xs" color="red" className="absolute left-2 bottom-2">{album.title}</Badge>
                    </div>
                </div>
            </div>
        );
    }

    if (albumsQuery.isLoading)
    {
        return (
            <div className='flex flex-col items-center justify-center flex-1'>
                <p className='text-xl'>Loading...</p>
            </div>
        );
    }

    if (albumsQuery.isError)
    {
        return (
            <div className='flex flex-col items-center justify-center flex-1'>
                <p className='text-xl'>Error loading albums</p>
            </div>
        );
    }

    return (
        <>
            <div className='grid' style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
                {albums.map((album: Album) => (
                    RenderAlbum(album)
                ))}
                <div ref={loaderRef} style={{ height: 1 }} />
            </div>

            <button onClick={() => createAlbumDrawerRef.current?.openDrawer()} className="action-button fixed bottom-8 right-8 bg-purple-400 text-white hover:scale-105 hover:bg-purple-500 transition-colors">
                <FaPlus size={20} />
            </button>

            <CreateAlbumDrawer ref={createAlbumDrawerRef} onAlbumCreated={() => { albumsQuery.refetch(); }} />

            <AlbumDetailDrawer
                ref={albumDetailDrawerRef}
                onAlbumDeleted={() => { albumsQuery.refetch(); }}
                onAlbumEdited={() => { albumsQuery.refetch(); }} />
        </>
    );
}