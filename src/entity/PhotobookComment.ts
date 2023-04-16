import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Photobook } from './Photobook';
import { User } from './User';

@Entity()
export class PhotobookComment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	content: string;

	@ManyToOne(() => Photobook, (photobook) => photobook.photobookComments)
	photobook: Photobook;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => User, (user) => user.photobookComments)
	author: User;
}
