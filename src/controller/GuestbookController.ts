import { Guestbook } from './../entity/Guestbook';
import { Request, Response } from 'express';
import { myDataBase } from '../db';
import { User } from '../entity/User';

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
}
