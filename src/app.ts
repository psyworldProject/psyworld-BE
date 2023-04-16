import { myDataBase } from './db';
import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // 불러오기
import AuthRouter from './router/auth';
import DiaryRouter from './router/diary';
import PhotobookRouter from './router/photobook';
import GuestbookRouter from './router/guestbook';
import UserRouter from './router/user';

// 캐시 형태로 발급된 토큰을 저장하기 위한 객체
export const tokenList = {};

myDataBase
	.initialize()
	.then(() => {
		console.log('DataBase has been initialized!');
	})
	.catch((error) => {
		console.error('Error during DataBase initialization:', error);
	});

const app = express();
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(
	cors({
		origin: true, // 모두 허용
	})
);
app.use(cookieParser()); // 미들웨어 등록
app.use('/auth', AuthRouter);
app.use('/diary', DiaryRouter);
app.use('/photobook', PhotobookRouter);
app.use('/guestbook', GuestbookRouter);
app.use('/user', UserRouter);

app.listen(3000, () => {
	console.log('Express server has started on port 3000');
});
