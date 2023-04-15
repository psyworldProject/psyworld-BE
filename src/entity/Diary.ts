import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Diary {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column()
	content: string;

	@Column()
	feelingCode: number;

	@Column()
	weatherCode: number;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => User, (user) => user.diaries)
	author: User;
}
