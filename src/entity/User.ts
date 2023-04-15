import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Diary } from './Diary';
import { DiaryComment } from './DiaryComments';

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

	@OneToMany(() => Diary, (diary) => diary.author)
	diaries: Diary[];

	@OneToMany(() => DiaryComment, (diaryComment) => diaryComment.author)
	diaryComments: DiaryComment[];
	@CreateDateColumn()
	createdAt: Date;
}
