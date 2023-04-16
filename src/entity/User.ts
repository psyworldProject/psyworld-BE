import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Diary } from './Diary';
import { DiaryComment } from './DiaryComments';
import { Photobook } from './Photobook';
import { Guestbook } from './Guestbook';
import { Like } from './Like';
import { PhotobookComment } from './PhotobookComment';
import { GuestbookComment } from './GuestbookComment';
import { Follow } from './Follow';

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

	@OneToMany(() => PhotobookComment, (photobookComment) => photobookComment.author)
	photobookComments: PhotobookComment[];

	@OneToMany(() => Guestbook, (guestbook) => guestbook.owner)
	guestbooks: Guestbook[];

	@OneToMany(() => GuestbookComment, (photobookComment) => photobookComment.author)
	guestbookComments: PhotobookComment[];

	@OneToMany(() => Like, (like) => like.user)
	likes: Like[];

	@OneToMany(() => Follow, (follow) => follow.follower)
	followers: Follow[];

	@OneToMany(() => Follow, (follow) => follow.following)
	following: Follow[];

	@CreateDateColumn()
	createdAt: Date;
}
