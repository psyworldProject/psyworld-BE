import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { DiaryComment } from './DiaryComments';
import { Like } from './Like';
import { PhotobookComment } from './PhotobookComment';

@Entity()
export class Photobook {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column()
	content: string;

	@Column()
	image: string;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => User, (user) => user.photobooks)
	author: User;

	@OneToMany(() => Like, (like) => like.photobook)
	likes: Like[];

	@OneToMany(() => PhotobookComment, (photobookComment) => photobookComment.photobook)
	photobookComments: PhotobookComment[];
}
