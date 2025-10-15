import { Music, MusicDto } from "./music";

export interface AlbumDto {
    id: string;
    title: string;
    artist: string;
    releaseDate: string;
    hasCoverImage: boolean;

    musics: MusicDto[];
}

export class Album {
    id: string;
    title: string;
    artist: string;
    releaseDate: Date;
    hasCoverImage: boolean;
    coverUrl: string | null = null;

    musics: Music[] = [];

    constructor(albumDto: AlbumDto) {
        this.id = albumDto.id;
        this.title = albumDto.title;
        this.artist = albumDto.artist;
        this.releaseDate = new Date(albumDto.releaseDate);
        this.hasCoverImage = albumDto.hasCoverImage;

        this.musics = albumDto.musics.map(musicDto => new Music(musicDto));
    }

    getDateString(): string {
        if (isNaN(this.releaseDate.getTime())) {
            return '';
        }

        const month = this.releaseDate.toLocaleString('default', { month: 'long' });

        return `${this.releaseDate.getDate()} ${month} ${this.releaseDate.getFullYear()}`
    }
}

export interface CreateAlbumDto {
    title: string;
    artist: string;
    releaseDate: string;
    coverImage?: File;
}

export interface UpdateAlbumDto {
    title: string;
    artist: string;
    releaseDate: string;
}