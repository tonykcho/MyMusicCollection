import { CreateMusicDto, Music, MusicDto, UpdateMusicDto } from "@/models/music";

export default class MusicService {
    static baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/music`;

    static async getMusics(offset: number = 0, limit: number = 20) {
        const response = await fetch(`${this.baseUrl}?offset=${offset}&limit=${limit}`);
        if (!response.ok) {
            throw new Error('Failed to fetch music');
        }
        const musicDtos: MusicDto[] = await response.json();
        return musicDtos.map((dto) => new Music(dto));
    }

    static async getMusicById(musicId: string) {
        const response = await fetch(`${this.baseUrl}/${musicId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch music');
        }
        const musicDto: MusicDto = await response.json();
        return new Music(musicDto);
    }

    static async createMusic(musicData: CreateMusicDto) {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(musicData)
        });

        if (!response.ok) {
            throw new Error('Failed to create music');
        }
    }

    static async updateMusic(musicId: string, musicData: UpdateMusicDto) {
        const response = await fetch(`${this.baseUrl}/${musicId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(musicData)
        });

        if (!response.ok) {
            throw new Error('Failed to update music');
        }
    }

    static async deleteMusic(musicId: string) {
        const response = await fetch(`${this.baseUrl}/${musicId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete music');
        }
    }
}
