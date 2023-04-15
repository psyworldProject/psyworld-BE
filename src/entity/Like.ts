import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { GuestBook } from "./GuestBook";

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GuestBook, (guestBook) => guestBook.likes, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  guestBook: GuestBook;

  @ManyToOne(() => User, (user) => user.likes, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: User;
}
