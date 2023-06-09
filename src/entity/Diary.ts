import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { DiaryComment } from './DiaryComments';

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

	@OneToMany(() => DiaryComment, (diaryComment) => diaryComment.diary)
	diaryComments: DiaryComment[];
}
