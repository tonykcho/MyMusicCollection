'use client';

import React, { useEffect } from "react";
import CreateMusicDrawer, { CreateMusicDrawerRef } from "./components/create-music-drawer";
import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";
import MusicService from "@/services/music-service";
import { Music } from "@/models/music";
import { FaPlus } from "react-icons/fa6";
import AlbumService from "@/services/album-service";

const PAGE_SIZE = 20;

export default function MusicPage() {
    const [coverUrls, setCoverUrls] = React.useState<{ [key: string]: string }>({});
    const createMusicDrawerRef = React.useRef<CreateMusicDrawerRef>(null);

    const musicQuery = useInfiniteQuery({
        queryKey: ['musics'],
        queryFn: async ({ pageParam = 0 }) => {
            const musics = await MusicService.getMusics(pageParam * PAGE_SIZE, PAGE_SIZE);
            return musics;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length === 0) {
                return undefined; // No more pages
            }
            return allPages.length; // Next page index
        }
    })

    const loaderRef = React.useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                musicQuery.fetchNextPage();
            }
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 1.0
        });

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [musicQuery.hasNextPage, musicQuery.fetchNextPage]);

    const musics: Music[] = musicQuery.data?.pages.flatMap(page => page) || [];
    const albumIds = Array.from(new Set(musics.filter(music => music.hasCoverImage).map(music => music.albumId)));

    useQueries({
        queries: albumIds.map(albumId => ({
            queryKey: ['musicCover', albumId],
            queryFn: async () => {
                const cover = await AlbumService.getAlbumCover(albumId);
                // make a url for the blob
                if (cover) {
                    setCoverUrls(prev => ({ ...prev, [albumId]: URL.createObjectURL(cover) }));
                }

                return cover;
            },
            enabled: !!albumId,
        }))
    })


    function RenderMusic(music: Music) {
        const coverUrl = coverUrls[music.albumId];
        music.coverUrl = coverUrl;
        return (
            <div className="flex flex-col items-center" key={music.id}>
                <div className="p-1 w-60 h-60 p-2 flex flex-col cursor-pointer hover:scale-105 transition-transform">
                    <div style={{ backgroundImage: music.coverUrl != null ? `url(${music.coverUrl})` : undefined, backgroundSize: 'cover' }} className="p-4 flex flex-col flex-1 border rounded-lg shadow-md hover:bg-gray-100 flex flex-col">
                        <div className="flex-1"></div>
                        <div className="flex items-end">
                            <div className="flex-1 flex flex-col">
                                <p className="text-sm text-gray-600">{music.artist}</p>
                                <p className="text-sm text-gray-600">{music.releaseDate.getFullYear()}</p>
                            </div>
                            <p className="text-lg font-semibold">{music.title}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (musicQuery.isLoading) {
        return (
            <div className='flex flex-col items-center justify-center flex-1'>
                <p className='text-xl'>Loading...</p>
            </div>
        );
    }

    if (musicQuery.isError) {
        return (
            <div className='flex flex-col items-center justify-center flex-1'>
                <p className='text-xl'>Error loading music.</p>
            </div>
        );
    }

    return (
        <>
            <div className='grid' style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
                {musics.map((music: Music) => (
                    RenderMusic(music)
                ))}
                <button onClick={() => createMusicDrawerRef.current?.openDrawer()} className="action-button fixed bottom-8 right-8 bg-purple-400 text-white hover:scale-105 hover:bg-purple-500 transition-colors">
                    <FaPlus size={20} />
                </button>
            </div>

            <CreateMusicDrawer ref={createMusicDrawerRef} onMusicCreated={() => { musicQuery.refetch(); }} />
        </>
    );
}