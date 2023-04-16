import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Photobook } from './Photobook';
import { User } from './User';

@Entity()
export class PhotobookComment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	content: string;

	@ManyToOne(() => Photobook, (photobook) => photobook.photobookComments, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	photobook: Photobook;

	@ManyToOne(() => User, (user) => user.photobookComments, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	author: User;

	@CreateDateColumn()
	createdAt: Date;
}
