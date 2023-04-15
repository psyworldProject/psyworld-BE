import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { GuestComment } from "./GuestBookComment";
import { Like } from "./Like";

@Entity()
export class GuestBook {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @OneToMany(() => GuestComment, (comment) => comment.guestBook) // (타입, 어트리뷰트) 명시
  comments: GuestComment[];

  @ManyToOne(() => User, (user) => user.guestBook) // author를 User의 posts와 연결
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Like, (like) => like.guestBook)
  likes: Like[];
}
