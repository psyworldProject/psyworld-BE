import { Request, Response } from 'express';
import { myDataBase } from '../db';
import { Diary } from '../entity/Diary';
import { User } from '../entity/User';

export class DiaryController {
	static getDiaries = async (req: Request, res: Response) => {
		const { id } = req.body;
		const author = await myDataBase.getRepository(User).findOne({
			where: { id },
		});

		if (!author) {
			return res.status(404).send({ message: '해당 유저를 찾을 수 없습니다.' });
		}
		const diaries = await myDataBase.getRepository(Diary).find({
			where: { author },
		});
		if (!diaries) {
			return res.status(404).send({ message: '일기가 없습니다.' });
		}
		res.status(200).json({ diaries });
	};
}
