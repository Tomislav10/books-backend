import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class BookEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: string;

    @Column()
    url!: string;

    @Column()
    name!: string;

    @Column()
    publisher!: string;

    @Column()
    released!: string

    @Column()
    favorite!: boolean

    @Column()
    country!: string

    @Column()
    mediaType!: string

    @Column()
    numberOfPages!: string

    @Column()
    isbn!: string
}
