import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Diary } from "./Diary";
import { GuestBook } from "./GuestBook";
import { Like } from "./Like";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // 이메일은 중복되지 않도록 설계
  email: string;

  @Column({ unique: true }) // 유저이름은 중복되지 않도록 설계
  username: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Diary, (diary) => diary.author) // author를 User의 posts와 연결
  posts: Diary[];

  @ManyToOne(() => Diary, (diary) => diary.author) // author를 User의 posts와 연결
  diary: Diary[];

  @ManyToOne(() => GuestBook, (guestBook) => guestBook.author) // author를 User의 posts와 연결
  guestBook: GuestBook[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
}
