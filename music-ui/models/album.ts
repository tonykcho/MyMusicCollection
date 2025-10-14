export interface AlbumDto {
    id: string;
    title: string;
    artist: string;
    releaseDate: string;
}

export class Album {
    id: string;
    title: string;
    artist: string;
    releaseDate: Date;
    coverUrl: string | null = null;

    constructor(albumDto: AlbumDto) {
        this.id = albumDto.id;
        this.title = albumDto.title;
        this.artist = albumDto.artist;
        this.releaseDate = new Date(albumDto.releaseDate);
    }
}

export interface CreateAlbumDto {
    title: string;
    artist: string;
    releaseDate: string;
    coverImage?: File;
}