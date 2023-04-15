import { Request, Response } from 'express';
import { JwtRequest } from '../middleware/AuthMiddleware';
import { myDataBase } from '../db';
import { User } from '../entity/User';
import { Photobook } from '../entity/Photobook';

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
			relations: ['author'],
		});
		if (!photobooks) {
			return res.status(404).send({ message: '일기가 없습니다.' });
		}
		res.status(200).json({ photobooks });
	};

	static getPhotobook = async (req: Request, res: Response) => {
		const { id } = req.params;
		const photobook = await myDataBase.getRepository(Photobook).findOne({
			where: { id: Number(id) },
			relations: ['author'],
		});
		if (!photobook) {
			return res.status(404).send({ message: '해당 일기를 찾을 수 없습니다.' });
		}
		res.status(200).json({ photobook });
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

	static updatePhotobook = async (req: JwtRequest, res: Response) => {};

	static deletePhotobook = async (req: JwtRequest, res: Response) => {};
}
