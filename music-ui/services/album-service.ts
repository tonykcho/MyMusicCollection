import { Album, AlbumDto, CreateAlbumDto, UpdateAlbumDto } from "@/models/album";

export default class AlbumService
{
    static baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/albums`;

    static async getAlbums(offset: number = 0, limit: number = 20)
    {
        const response = await fetch(`${this.baseUrl}?offset=${offset}&limit=${limit}`);
        if (!response.ok)
        {
            throw new Error('Failed to fetch albums');
        }
        const albumDtos: AlbumDto[] = await response.json();
        return albumDtos.map((dto) => new Album(dto));
    }

    static async getAlbumById(albumId: string)
    {
        const response = await fetch(`${this.baseUrl}/${albumId}`);
        if (!response.ok)
        {
            throw new Error('Failed to fetch album');
        }
        const albumDto: AlbumDto = await response.json();
        return new Album(albumDto);
    }

    static async getAlbumCover(albumId: string)
    {
        const response = await fetch(`${this.baseUrl}/${albumId}/cover`);
        if (!response.ok)
        {
            throw new Error('Failed to fetch album cover');
        }
        return response.blob();
    }

    static async createAlbum(albumData: CreateAlbumDto)
    {
        const formData = new FormData();
        formData.append('Title', albumData.title);
        formData.append('Artist', albumData.artist);
        formData.append('ReleaseDate', albumData.releaseDate);
        if (albumData.coverImage)
        {
            formData.append('CoverImage', albumData.coverImage);
        }

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            body: formData
        });
        if (!response.ok)
        {
            throw new Error('Failed to create album');
        }
    }

    static async updateAlbum(albumId: string, albumData: UpdateAlbumDto)
    {
        const response = await fetch(`${this.baseUrl}/${albumId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(albumData)
        });
        if (!response.ok)
        {
            throw new Error('Failed to update album');
        }
    }

    static async deleteAlbum(albumId: string)
    {
        const response = await fetch(`${this.baseUrl}/${albumId}`, {
            method: 'DELETE'
        });
        if (!response.ok)
        {
            throw new Error('Failed to delete album');
        }
    }
}