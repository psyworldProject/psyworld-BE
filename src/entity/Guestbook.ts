import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { GuestbookComment } from './GuestbookComment';

@Entity()
export class Guestbook {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	content: string;

	@ManyToOne(() => User, (user) => user.guestbooks)
	author: User;

	@ManyToOne(() => User, (user) => user.guestbooks)
	owner: User;

	@OneToMany(() => GuestbookComment, (guestbookComment) => guestbookComment.guestbook)
	guestbookComments: GuestbookComment[];

	@CreateDateColumn()
	createdAt: Date;
}
