import { Request, Response } from 'express';
import { JwtRequest } from '../middleware/AuthMiddleware';
import { myDataBase } from '../db';
import { User } from '../entity/User';
import { Photobook } from '../entity/Photobook';
import { Like } from '../entity/Like';
import { PhotobookComment } from '../entity/PhotobookComment';

interface MulterS3Request extends Request {
	file: Express.MulterS3.File;
}

export class PhotobookController {
	// 특정 유저 사진첩 가져오기
	static getPhotobooks = async (req: Request, res: Response) => {
		const { id } = req.body;
		const author = await myDataBase.getRepository(User).findOne({
			where: { id },
		});

		if (!author) {
			return res.status(404).send({ message: '해당 유저를 찾을 수 없습니다.' });
		}
		const photobooks = await myDataBase.getRepository(Photobook).find({
			relations: ['author', 'likes'],
			select: {
				author: {
					id: true,
					username: true,
					email: true,
				},
				photobookComments: {
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
		if (!photobooks) {
			return res.status(404).send({ message: '해당 일기를 찾을 수 없습니다.' });
		}
		res.status(200).json({ photobooks });
	};

	static getPhotobook = async (req: Request, res: Response) => {
		const { id } = req.params;
		const result = await myDataBase.getRepository(Photobook).findOne({
			where: { id: Number(id) },
			relations: ['author', 'photobookComments', 'photobookComments.author', 'likes'],
			select: {
				author: {
					id: true,
					username: true,
					profileImage: true,
				},
				photobookComments: {
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
		if (!result) {
			return res.status(404).send({ message: '해당 일기를 찾을 수 없습니다.' });
		}
		res.status(200).json({ result });
	};

	static createPhotobook = async (req: JwtRequest & MulterS3Request, res: Response) => {
		const { id: userId } = req.decoded;
		const author = await myDataBase.getRepository(User).findOne({
			where: { id: userId },
			relations: {
				photobooks: true,
			},
		});
		if (!author) {
			return res.status(404).send({ message: '해당 유저를 찾을 수 없습니다.' });
		}

		const { title, content } = req.body;
		const { location } = req.file;
		const photobook = new Photobook();
		photobook.title = title;
		photobook.content = content;
		photobook.author = author;
		photobook.image = location;
		const result = await myDataBase.getRepository(Photobook).insert(photobook);
		res.status(201).json({ result });
	};

	static updatePhotobook = async (req: JwtRequest & MulterS3Request, res: Response) => {
		const { id: userId } = req.decoded;
		const author = await myDataBase.getRepository(User).findOne({
			where: { id: userId },
			relations: {
				photobooks: true,
			},
		});
		if (!author) {
			return res.status(404).send({ message: '해당 유저를 찾을 수 없습니다.' });
		}

		const { title, content } = req.body;
		const { location } = req.file;
		const photobook = new Photobook();
		photobook.title = title;
		photobook.content = content;
		photobook.image = location ? location : photobook.image;
		const result = await myDataBase.getRepository(Photobook).update(userId, photobook);
		res.send(result);
	};

	static deletePhotobook = async (req: JwtRequest, res: Response) => {
		const { id: userId } = req.decoded;
		const author = await myDataBase.getRepository(User).findOne({
			where: { id: userId },
			relations: {
				photobooks: true,
			},
		});
		if (!author) {
			return res.status(404).send({ message: '해당 유저를 찾을 수 없습니다.' });
		}
		const currentPhoto = await myDataBase.getRepository(Photobook).findOne({
			where: { id: Number(req.params.id) },
		});

		if (!currentPhoto) {
			return res.status(404).send({ message: '해당 일기를 찾을 수 없습니다.' });
		}

		await myDataBase.getRepository(Photobook).remove(currentPhoto);
		res.send({ message: '해당 다이어리가 삭제되었습니다.' });
	};

	static likePost = async (req: JwtRequest, res: Response) => {
		const { id: userId } = req.decoded;
		// 이미 해당 게시글에 좋아요를 한 사람인지 확인
		const isExist = await myDataBase.getRepository(Like).findOne({
			where: {
				photobook: { id: Number(req.params.id) },
				user: { id: userId }, // {id: 유저아이디} 가 요청 시에 필요
			},
		});

		// 이미 좋아요를 누른게 아니라면
		if (!isExist) {
			// 해당 게시글, 유저를 토대로 Like 생성
			const photobook = await myDataBase.getRepository(Photobook).findOneBy({
				id: Number(req.params.id),
			});
			const user = await myDataBase.getRepository(User).findOneBy({
				id: userId,
			});

			const like = new Like();
			like.photobook = photobook;
			like.user = user;
			await myDataBase.getRepository(Like).insert(like);
		} else {
			// 좋아요를 이미 누른 상황이라면 해당 좋아요 삭제
			await myDataBase.getRepository(Like).remove(isExist);
		}
		return res.send({ message: 'success' });
	};

	static createComment = async (req: JwtRequest, res: Response) => {
		const { id: userId } = req.decoded;
		const author = await myDataBase.getRepository(User).findOne({
			where: { id: userId },
			relations: {
				photobooks: true,
			},
		});
		if (!author) {
			return res.status(404).send({ message: '해당 유저를 찾을 수 없습니다.' });
		}
		const photobook = await myDataBase.getRepository(Photobook).findOne({
			where: { id: Number(req.params.id) },
		});
		if (!photobook) {
			return res.status(404).send({ message: '해당 사진첩을 찾을 수 없습니다.' });
		}
		const { content } = req.body;
		const comment = new PhotobookComment();
		comment.content = content;
		comment.author = author;
		comment.photobook = photobook;
		const result = await myDataBase.getRepository(PhotobookComment).save(comment);
		res.status(201).send(result);
	};

	static updateComment = async (req: JwtRequest, res: Response) => {
		const { id: userId } = req.decoded;
		const author = await myDataBase.getRepository(User).findOne({
			where: { id: userId },
			relations: {
				photobooks: true,
			},
		});
		if (!author) {
			return res.status(404).send({ message: '해당 유저를 찾을 수 없습니다.' });
		}
		const { id: photobookId, commentId } = req.params;
		const photobook = await myDataBase.getRepository(Photobook).findOne({
			where: { id: Number(photobookId) },
		});
		if (!photobook) {
			return res.status(404).send({ message: '해당 사진첩을 찾을 수 없습니다.' });
		}
		const currentComment = await myDataBase.getRepository(PhotobookComment).findOne({
			where: { id: Number(commentId) },
		});
		if (!currentComment) {
			return res.status(404).send({ message: '해당 댓글을 찾을 수 없습니다.' });
		}
		const { content } = req.body;
		const newComment = new PhotobookComment();
		newComment.content = content;
		const results = await myDataBase.getRepository(PhotobookComment).update(currentComment.id, newComment);
		res.send(results);
	};

	static deleteComment = async (req: JwtRequest, res: Response) => {
		const { id: userId } = req.decoded;
		const author = await myDataBase.getRepository(User).findOne({
			where: { id: userId },
			relations: {
				photobooks: true,
			},
		});
		if (!author) {
			return res.status(404).send({ message: '해당 유저를 찾을 수 없습니다.' });
		}
		const { id: photobookId, commentId } = req.params;
		const photobook = await myDataBase.getRepository(Photobook).findOne({
			where: { id: Number(photobookId) },
		});
		if (!photobook) {
			return res.status(404).send({ message: '해당 사진첩을 찾을 수 없습니다.' });
		}
		const currentComment = await myDataBase.getRepository(PhotobookComment).findOne({
			where: { id: Number(commentId) },
		});
		if (!currentComment) {
			return res.status(404).send({ message: '해당 댓글을 찾을 수 없습니다.' });
		}
		await myDataBase.getRepository(PhotobookComment).remove(currentComment);
		res.send({ message: '해당 댓글이 삭제되었습니다.' });
	};
}
