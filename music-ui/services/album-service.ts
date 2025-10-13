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
        const formData = new FormData();
        formData.append('Title', albumData.title);
        formData.append('Artist', albumData.artist);
        formData.append('ReleaseDate', albumData.releaseDate);
        if (albumData.coverImage) {
            formData.append('CoverImage', albumData.coverImage);
        }

        console.log('Submitting album with data:', albumData);

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error('Failed to create album');
        }
    }
}