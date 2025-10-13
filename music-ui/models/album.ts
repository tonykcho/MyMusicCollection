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

    constructor(albumDto: AlbumDto) {
        this.id = albumDto.id;
        this.title = albumDto.title;
        this.artist = albumDto.artist;
        this.releaseDate = new Date(albumDto.releaseDate);
    }
}