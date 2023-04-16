import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Diary } from './Diary';
import { User } from './User';

@Entity()
export class DiaryComment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	content: string;

	@ManyToOne(() => Diary, (diary) => diary.diaryComments, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	diary: Diary;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => User, (user) => user.diaryComments, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	author: User;
}
