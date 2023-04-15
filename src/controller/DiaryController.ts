import { Request, Response } from "express";
import { JwtRequest } from "../middleware/AuthMiddleware";
import { myDataBase } from "../db";
import { User } from "../entity/User";
import { Diary } from "../entity/Diary";

export class DiaryController {
  static createDiary = async (req: JwtRequest, res: Response) => {
    // 유저가 작성한 글 데이터를 req.body에서 꺼냄
    const { body } = req.body;
    const { id: userId } = req.decoded;

    const user = await myDataBase.getRepository(User).findOne({
      where: { id: userId },
    });

    const diary = new Diary();
    diary.body = body;
    diary.author = user;

    const result = await myDataBase.getRepository(Diary).insert(diary);

    res.status(201).send(result);
  };
  static getDiaries = async (req: Request, res: Response) => {
    const results = await myDataBase.getRepository(Diary).find({
      select: {
        author: {
          id: true,
          username: true,
        },
      },
      relations: {
        author: true,
      },
    });
    res.send(results);
  };
  static getDiary = async (req: Request, res: Response) => {
    const results = await myDataBase.getRepository(Diary).findOne({
      where: { id: Number(req.params.id) },
      select: {
        author: {
          id: true,
          username: true,
        },
      },
      relations: { author: true },
    });
    res.send(results);
  };

  // 글 수정 - 인증 로직 추가
  static updateDiary = async (req: JwtRequest, res: Response) => {
    const { id: userId } = req.decoded;

    const currentPost = await myDataBase.getRepository(Diary).findOne({
      where: { id: Number(req.params.id) },
      relations: {
        author: true, // 데이터 가져올 때 author 도 표시하도록 설정 / ['author'] 라고 작성해도 됨
      },
    });
    if (userId !== currentPost.author.id) {
      // 글 작성자와 요청 보낸 사람이 일치하지 않으면
      return res.status(401).send("No Permission"); // 거부
    }

    const { body } = req.body;
    const newDairy = new Diary();
    newDairy.body = body;

    const results = await myDataBase
      .getRepository(Diary)
      .update(Number(req.params.id), newDairy);
    res.send(results);
  };

  // deleteDairy 메서드 추가
  static deleteDairy = async (req: JwtRequest, res: Response) => {
    const { id: userId } = req.decoded;

    const currentPost = await myDataBase.getRepository(Diary).findOne({
      where: { id: Number(req.params.id) },
      relations: {
        author: true,
      },
    });

    if (userId !== currentPost.author.id) {
      // 글 작성자와 요청 보낸 사람이 일치하지 않으면
      return res.status(401).send("No Permission"); // 거부
    }

    const results = await myDataBase
      .getRepository(Diary)
      .delete(Number(req.params.id));
    res.status(204).send(results);
  };
}
