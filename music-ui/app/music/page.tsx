'use client';

import React from "react";
import CreateMusicDrawer, { CreateMusicDrawerRef } from "./components/create-music-drawer";
import { useQuery } from "@tanstack/react-query";
import MusicService from "@/services/music-service";
import { Music } from "@/models/music";
import { FaPlus } from "react-icons/fa6";

export default function MusicPage() {
    const createMusicDrawerRef = React.useRef<CreateMusicDrawerRef>(null);

    const musicQuery = useQuery({
        queryKey: ['music'],
        queryFn: async () => {
            const musics = await MusicService.getMusics();
            return musics;
        }
    });

    function RenderMusic(music: Music) {
        return (<div className="p-1 w-1/5 h-68 p-2 flex flex-col cursor-pointer hover:scale-105 transition-transform" key={music.id}>
            <div className="p-4 flex flex-col flex-1 border rounded-lg shadow-md hover:bg-gray-100 flex flex-col">
                <div className="flex-1"></div>
                <div className="flex items-end">
                    <div className="flex-1 flex flex-col">
                        <p className="text-sm text-gray-600">{music.artist}</p>
                        <p className="text-sm text-gray-600">{music.releaseDate.getFullYear()}</p>
                    </div>
                    <p className="text-lg font-semibold">{music.title}</p>
                </div>
            </div>
        </div>);
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
            <div className='flex flex-row flex-wrap overflow-y-auto p-2'>
                {musicQuery.data?.map((music: Music) => (
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