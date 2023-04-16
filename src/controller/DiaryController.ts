import { Request, Response } from 'express';
import { myDataBase } from '../db';
import { Diary } from '../entity/Diary';
import { User } from '../entity/User';
import { JwtRequest } from '../middleware/AuthMiddleware';
import { DiaryComment } from '../entity/DiaryComments';

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
		res.status(200).json({ results });
	};

	// 다이어리 상세 정보 가져오기
	static getDiary = async (req: Request, res: Response) => {
		const { id } = req.params;
		const result = await myDataBase.getRepository(Diary).findOne({
			where: { id: Number(id) },
			relations: ['author', 'diaryComments', 'diaryComments.author'],
			select: {
				author: {
					id: true,
					username: true,
					profileImage: true,
				},
				diaryComments: {
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
		const result = await myDataBase.getRepository(Diary).insert(diary);
		res.status(201).send(result);
	};

	// 다이어리 수정하기
	static updateDiary = async (req: JwtRequest, res: Response) => {
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
		const { title, content, weatherCode, feelingCode } = req.body;
		const diary = await myDataBase.getRepository(Diary).findOne({
			where: { id: Number(req.params.id) },
		});
		if (!diary) {
			return res.status(404).send({ message: '해당 일기를 찾을 수 없습니다.' });
		}

		const newDiary = new Diary();
		newDiary.title = title;
		newDiary.content = content;
		newDiary.weatherCode = weatherCode;
		newDiary.feelingCode = feelingCode;
		const results = await myDataBase.getRepository(Diary).update(diary.id, newDiary);
		res.send(results);
	};

	// 다이어리 삭제하기
	static deleteDiary = async (req: JwtRequest, res: Response) => {
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
		const currentDiary = await myDataBase.getRepository(Diary).findOne({
			where: { id: Number(req.params.id) },
		});

		if (!currentDiary) {
			return res.status(404).send({ message: '해당 일기를 찾을 수 없습니다.' });
		}

		await myDataBase.getRepository(Diary).remove(currentDiary);
		res.send({ message: '해당 다이어리가 삭제되었습니다.' });
	};

	//다이어리에 댓글 달기
	static createComment = async (req: JwtRequest, res: Response) => {
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
		const diary = await myDataBase.getRepository(Diary).findOne({
			where: { id: Number(req.params.id) },
		});
		if (!diary) {
			return res.status(404).send({ message: '해당 일기를 찾을 수 없습니다.' });
		}
		const { content } = req.body;
		const comment = new DiaryComment();
		comment.content = content;
		comment.author = author;
		comment.diary = diary;
		const result = await myDataBase.getRepository(DiaryComment).insert(comment);
		res.status(201).send(result);
	};

	//다이어리 댓글 수정하기
	static updateComment = async (req: JwtRequest, res: Response) => {
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

		const { id: diaryId, commentId } = req.params;
		const diary = await myDataBase.getRepository(Diary).findOne({
			where: { id: Number(diaryId) },
		});
		if (!diary) {
			return res.status(404).send({ message: '해당 일기를 찾을 수 없습니다.' });
		}
		const comment = await myDataBase.getRepository(DiaryComment).findOne({
			where: { id: Number(commentId) },
		});
		if (!comment) {
			return res.status(404).send({ message: '해당 댓글을 찾을 수 없습니다.' });
		}
		const { content } = req.body;
		const newComment = new DiaryComment();
		newComment.content = content;
		const results = await myDataBase.getRepository(DiaryComment).update(comment.id, newComment);
		res.send(results);
	};

	//다이어리 댓글 삭제하기
	static deleteComment = async (req: JwtRequest, res: Response) => {
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
		const { id: diaryId, commentId } = req.params;
		const diary = await myDataBase.getRepository(Diary).findOne({
			where: { id: Number(diaryId) },
		});
		if (!diary) {
			return res.status(404).send({ message: '해당 일기를 찾을 수 없습니다.' });
		}
		const currentComment = await myDataBase.getRepository(DiaryComment).findOne({
			where: { id: Number(commentId) },
		});
		if (!currentComment) {
			return res.status(404).send({ message: '해당 댓글을 찾을 수 없습니다.' });
		}
		await myDataBase.getRepository(DiaryComment).remove(currentComment);
		res.send({ message: '해당 댓글이 삭제되었습니다.' });
	};
}
