import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Photobook } from './Photobook';

@Entity()
export class Like {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Photobook, (photobook) => photobook.likes, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	photobook: Photobook;

	@ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	user: User;
}
