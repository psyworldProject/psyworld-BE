import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { DiaryComment } from "./DiaryComment";
import { User } from "./User";

@Entity()
export class Diary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @OneToMany(() => DiaryComment, (comment) => comment.diary) // (타입, 어트리뷰트) 명시
  comments: DiaryComment[];

  @ManyToOne(() => User, (user) => user.diary) // author를 User의 posts와 연결
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
