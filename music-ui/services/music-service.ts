import { CreateMusicDto, Music, MusicDto } from "@/models/music";

export default class MusicService {
    static baseUrl = 'https://localhost:7279/api/music';

    static async getMusics() {
        const response = await fetch(this.baseUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch music');
        }
        const musicDtos: MusicDto[] = await response.json();
        return musicDtos.map((dto) => new Music(dto));
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

    static async deleteMusic(musicId: string) {
        const response = await fetch(`${this.baseUrl}/${musicId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete music');
        }
    }
}
