import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Guestbook } from './Guestbook';
import { User } from './User';

@Entity()
export class GuestbookComment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	content: string;

	@ManyToOne(() => Guestbook, (guestbook) => guestbook.guestbookComments, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	guestbook: Guestbook;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => User, (user) => user.guestbookComments, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	author: User;
}
