import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Diary } from './Diary';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	email: string;

	@Column()
	username: string;

	@Column()
	password: string;

	@Column()
	profileImage: string;

	@Column()
	statusCode: number;

	@CreateDateColumn()
	createdAt: Date;

	@OneToMany(() => Diary, (diary) => diary.author)
	diaries: Diary[];
}
