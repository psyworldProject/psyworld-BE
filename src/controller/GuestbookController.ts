import { Guestbook } from './../entity/Guestbook';
import { Request, Response } from 'express';
import { myDataBase } from '../db';
import { User } from '../entity/User';
import { JwtRequest } from '../middleware/AuthMiddleware';
import { GuestbookComment } from '../entity/GuestbookComment';

export class GuestbookController {
	static getGuestbookbyOwnerId = async (req: Request, res: Response) => {
		const { id: userId } = req.body;
		const owner = await myDataBase.getRepository(User).findOne({
			where: { id: userId },
		});

		if (!owner) {
			return res.status(404).send({ message: '해당 유저를 찾을 수 없습니다.' });
		}
		const guestbook = await myDataBase.getRepository(Guestbook).find({
			where: { owner: { id: 1 } },
			relations: ['author', 'guestbookComments', 'guestbookComments.author'],
			select: {
				author: {
					id: true,
					username: true,
					profileImage: true,
				},
				guestbookComments: {
					author: {
						id: true,
						username: true,
						profileImage: true,
					},
				},
			},
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

	static updateGuestbook = async (req: JwtRequest, res: Response) => {
		const { id: userId } = req.decoded;

		const author = await myDataBase.getRepository(User).findOne({
			where: { id: userId },
		});
		if (!author) {
			return res.status(404).send({ message: '해당 유저를 찾을 수 없습니다.' });
		}

		const { id: guestbookId } = req.params;
		const guestbook = await myDataBase.getRepository(Guestbook).findOne({
			where: { id: Number(guestbookId) },
		});

		if (!guestbook) {
			return res.status(404).send({ message: '해당 방명록을 찾을 수 없습니다.' });
		}
		const { content } = req.body;
		guestbook.content = content;

		const result = await myDataBase.getRepository(Guestbook).update(guestbook.id, guestbook);

		res.status(200).json({ result });
	};

	static deleteGuestbook = async (req: JwtRequest, res: Response) => {
		const { id: userId } = req.decoded;

		const author = await myDataBase.getRepository(User).findOne({
			where: { id: userId },
		});
		if (!author) {
			return res.status(404).send({ message: '해당 유저를 찾을 수 없습니다.' });
		}

		const { id: guestbookId } = req.params;
		const guestbook = await myDataBase.getRepository(Guestbook).findOne({
			where: { id: Number(guestbookId) },
		});

		if (!guestbook) {
			return res.status(404).send({ message: '해당 방명록을 찾을 수 없습니다.' });
		}

		const result = await myDataBase.getRepository(Guestbook).delete(guestbook.id);

		res.status(200).json({ result });
	};

	static createComment = async (req: JwtRequest, res: Response) => {
		const { id: userId } = req.decoded;

		const author = await myDataBase.getRepository(User).findOne({
			where: { id: userId },
			relations: ['guestbooks'],
		});
		if (!author) {
			return res.status(404).send({ message: '해당 유저를 찾을 수 없습니다.' });
		}

		const { id: guestbookId } = req.params;
		const guestbook = await myDataBase.getRepository(Guestbook).findOne({
			where: { id: Number(guestbookId) },
		});

		if (!guestbook) {
			return res.status(404).send({ message: '해당 방명록을 찾을 수 없습니다.' });
		}

		const { content } = req.body;
		const newComment = new GuestbookComment();
		newComment.content = content;
		newComment.author = author;
		const result = await myDataBase.getRepository(Guestbook).update(guestbook.id, guestbook);
		res.status(201).json({ result });
	};
	static updateComment = async (req: JwtRequest, res: Response) => {};
	static deleteComment = async (req: JwtRequest, res: Response) => {};
}
