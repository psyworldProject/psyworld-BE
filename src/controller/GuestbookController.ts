import { Guestbook } from './../entity/Guestbook';
import { Request, Response } from 'express';
import { myDataBase } from '../db';
import { User } from '../entity/User';
import { JwtRequest } from '../middleware/AuthMiddleware';

export class GuestbookController {
	static getGuestbook = async (req: Request, res: Response) => {
		const { id: userId } = req.body;
		const owner = await myDataBase.getRepository(User).findOne({
			where: { id: userId },
		});

		if (!owner) {
			return res.status(404).send({ message: '해당 유저를 찾을 수 없습니다.' });
		}

		const guestbook = await myDataBase.getRepository(Guestbook).find({
			relations: ['owner'],
		});
		res.status(200).json({ guestbook });
	};

	static createGuestbook = async (req: JwtRequest, res: Response) => {
		const { content, ownerId } = req.body;
		const { id: userId } = req.decoded;

		const owner = await myDataBase.getRepository(User).findOne({
			where: { id: ownerId },
		});
		const author = await myDataBase.getRepository(User).findOne({
			where: { id: userId },
		});
		if (!owner || !author) {
			return res.status(404).send({ message: '해당 유저를 찾을 수 없습니다.' });
		}

		const guestbook = new Guestbook();
		guestbook.content = content;
		guestbook.owner = owner;
		guestbook.author = author;

		const result = await myDataBase.getRepository(Guestbook).insert(guestbook);

		res.status(201).json({ result });
	};
}
