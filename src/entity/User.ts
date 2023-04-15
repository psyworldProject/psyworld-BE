import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Diary } from './Diary';
import { DiaryComment } from './DiaryComments';
import { Photobook } from './Photobook';
import { Guestbook } from './Guestbook';
import { Like } from './Like';

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

	@OneToMany(() => Photobook, (photobook) => photobook.author)
	photobooks: Photobook[];

	@OneToMany(() => Guestbook, (guestbook) => guestbook.owner)
	guestbooks: Guestbook[];

	@OneToMany(() => Like, (like) => like.user)
	likes: Like[];

	@CreateDateColumn()
	createdAt: Date;
}
