import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { GuestBook } from "./GuestBook";

@Entity()
export class GuestComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => GuestBook, (guestBook) => guestBook.comments)
  guestBook: GuestBook; // 정확히 어떤 게시글에 달린 댓글인지
}
