import { Request, Response } from 'express';
import { myDataBase } from '../db';
import { Diary } from '../entity/Diary';
import { User } from '../entity/User';
import { JwtRequest } from '../middleware/AuthMiddleware';

export class DiaryController {
	// 특정 유저 다이어리 가져오기
	static getDiaries = async (req: Request, res: Response) => {
		const { id } = req.body;
		const author = await myDataBase.getRepository(User).findOne({
			where: { id },
		});

		if (!author) {
			return res.status(404).send({ message: '해당 유저를 찾을 수 없습니다.' });
		}
		const results = await myDataBase.getRepository(Diary).find({
			relations: ['author'],
		});
		if (!results) {
			return res.status(404).send({ message: '일기가 없습니다.' });
		}
		res.status(200).json({ results });
	};

	// 다이어리 상세 젇보 가져오기
	static getDiary = async (req: Request, res: Response) => {
		const { id } = req.params;
		const result = await myDataBase.getRepository(Diary).findOne({
			where: { id: Number(id) },
			relations: ['author'],
		});
		if (!result) {
			return res.status(404).send({ message: '해당 일기를 찾을 수 없습니다.' });
		}
		res.status(200).json({ result });
	};
	// 다이어리 생성하기
	static createDiary = async (req: JwtRequest, res: Response) => {
		const { title, content, feelingCode, weatherCode } = req.body;
		const { id: userId } = req.decoded;

		const author = await myDataBase.getRepository(User).findOne({
			where: { id: userId },
			relations: {
				diaries: true,
			},
		});
		if (!author) {
			return res.status(404).send({ message: '해당 유저를 찾을 수 없습니다.' });
		}
		const diary = new Diary();
		diary.title = title;
		diary.content = content;
		diary.feelingCode = feelingCode;
		diary.weatherCode = weatherCode;
		diary.author = author;
		const result = await myDataBase.getRepository(Diary).save(diary);
		res.status(201).send(result);
	};
}