export interface MusicDto {
    id: string;
    title: string;
    artist: string;
    releaseDate: string; // ISO date string
    hasCoverImage: boolean;
    albumId: string;
    isFavorite: boolean;
}

export class Music {
    id: string;
    title: string;
    artist: string;
    releaseDate: Date;
    hasCoverImage: boolean;
    albumId: string;
    coverUrl: string | null = null;
    isFavorite: boolean;

    constructor(dto: MusicDto) {
        this.id = dto.id;
        this.title = dto.title;
        this.artist = dto.artist;
        this.releaseDate = new Date(dto.releaseDate);
        this.hasCoverImage = dto.hasCoverImage;
        this.albumId = dto.albumId;
        this.isFavorite = dto.isFavorite;
    }

    getDateString(): string {
        if (isNaN(this.releaseDate.getTime())) {
            return '';
        }

        const month = this.releaseDate.toLocaleString('default', { month: 'long' });

        return `${this.releaseDate.getDate()} ${month} ${this.releaseDate.getFullYear()}`
    }
}

export interface CreateMusicDto {
    title: string;
    artist: string;
    releaseDate: string; // ISO date string
    albumId: string | null;
}

export interface UpdateMusicDto {
    title: string;
    artist: string;
    releaseDate: string; // ISO date string
}