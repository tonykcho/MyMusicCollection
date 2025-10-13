import { Album, CreateAlbumDto } from "@/models/album";

export default class AlbumService {
    static baseUrl = 'https://localhost:7279/api/albums';

    static async getAlbums() {
        const response = await fetch(this.baseUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch albums');
        }
        const albumDtos = await response.json();
        return albumDtos.map((dto: any) => new Album(dto));
    }

    static async createAlbum(albumData: CreateAlbumDto) {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(albumData),
        });
        if (!response.ok) {
            throw new Error('Failed to create album');
        }
    }
}