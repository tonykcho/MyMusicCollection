export interface MusicDto {
    id: string;
    title: string;
    artist: string;
    releaseDate: string; // ISO date string
    hasCoverImage: boolean;
    albumId: string;
}

export class Music {
    id: string;
    title: string;
    artist: string;
    releaseDate: Date;
    hasCoverImage: boolean;
    albumId: string;
    coverUrl: string | null = null;

    constructor(dto: MusicDto) {
        this.id = dto.id;
        this.title = dto.title;
        this.artist = dto.artist;
        this.releaseDate = new Date(dto.releaseDate);
        this.hasCoverImage = dto.hasCoverImage;
        this.albumId = dto.albumId;
    }
}

export interface CreateMusicDto {
    title: string;
    artist: string;
    releaseDate: string; // ISO date string
    albumId: string | null;
}