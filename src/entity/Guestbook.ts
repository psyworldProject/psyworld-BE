import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

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

	@CreateDateColumn()
	createdAt: Date;
}
