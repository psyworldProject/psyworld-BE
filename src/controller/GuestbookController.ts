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
					id: true,
					content: true,
					createdAt: true,
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
			relations: ['author'],
		});

		if (!guestbook) {
			return res.status(404).send({ message: '해당 방명록을 찾을 수 없습니다.' });
		}
		if (guestbook.author.id !== userId) {
			return res.status(403).send({ message: '해당 방명록을 수정할 권한이 없습니다.' });
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
			relations: ['author'],
		});

		if (!guestbook) {
			return res.status(404).send({ message: '해당 방명록을 찾을 수 없습니다.' });
		}
		if (guestbook.author.id !== userId) {
			return res.status(403).send({ message: '해당 방명록을 삭제할 권한이 없습니다.' });
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
		newComment.guestbook = guestbook;
		const result = await myDataBase.getRepository(GuestbookComment).insert(newComment);
		res.status(201).json({ result });
	};
	static updateComment = async (req: JwtRequest, res: Response) => {
		const { id: userId } = req.decoded;

		const author = await myDataBase.getRepository(User).findOne({
			where: { id: userId },
			relations: ['guestbooks'],
		});
		if (!author) {
			return res.status(404).send({ message: '해당 유저를 찾을 수 없습니다.' });
		}

		const { commentId } = req.params;
		const comment = await myDataBase.getRepository(GuestbookComment).findOne({
			where: { id: Number(commentId) },
			relations: ['author'],
		});
		if (!comment) {
			return res.status(404).send({ message: '해당 댓글을 찾을 수 없습니다.' });
		}
		if (comment.author.id !== userId) {
			return res.status(403).send({ message: '권한이 없습니다.' });
		}
		const { content } = req.body;
		const newComment = new GuestbookComment();
		newComment.content = content;

		const result = await myDataBase.getRepository(GuestbookComment).update(comment.id, newComment);
		res.status(200).json({ result });
	};
	static deleteComment = async (req: JwtRequest, res: Response) => {
		const { id: userId } = req.decoded;
		const author = await myDataBase.getRepository(User).findOne({
			where: { id: userId },
			relations: ['guestbooks'],
		});
		if (!author) {
			return res.status(404).send({ message: '해당 유저를 찾을 수 없습니다.' });
		}

		const { commentId } = req.params;
		const comment = await myDataBase.getRepository(GuestbookComment).findOne({
			where: { id: Number(commentId) },
			relations: ['author'],
		});
		if (!comment) {
			return res.status(404).send({ message: '해당 댓글을 찾을 수 없습니다.' });
		}
		if (comment.author.id !== userId) {
			return res.status(403).send({ message: '권한이 없습니다.' });
		}
		const result = await myDataBase.getRepository(GuestbookComment).delete(comment.id);

		res.status(200).json({ result });
	};
}
