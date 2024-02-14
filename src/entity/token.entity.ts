import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';

@Entity()
export class TokenEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    user_id!: number;

    @Column()
    token!: string;

    @CreateDateColumn()
    created_at!: Date;

    @CreateDateColumn()
    expired_at!: Date;
}
