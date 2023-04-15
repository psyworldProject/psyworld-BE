import { Request, Response } from 'express';
import { User } from '../entity/User';
import { generateAccessToken, generatePassword, generateRefreshToken, registerToken, removeToken } from '../util/Auth';
import { verify } from 'jsonwebtoken';
import { myDataBase } from '../db';
import bcrypt from 'bcrypt';
import { JwtRequest } from '../middleware/AuthMiddleware';

export class UserController {
	static checkDuplicate = async (req: Request, res: Response) => {
		// 이메일 중복 체크
		const { email } = req.body;
		const existUser = await myDataBase.getRepository(User).findOne({
			where: { email },
		});

		// 중복 -> 400 리턴
		if (existUser) {
			res.status(400).send({ message: '이미 존재하는 이메일입니다.' });
		} else {
			res.status(200).send({ message: '사용 가능한 이메일입니다.' });
		}
	};

	static register = async (req: Request, res: Response) => {
		const { username, email, password } = req.body;
		const user = new User();
		user.username = username;
		user.email = email;
		user.password = await generatePassword(password);

		// 회원가입 시 자동 로그인 구현 -> 액세스 토큰 및 리프레시 토큰 발급
		const accessToken = generateAccessToken(user.id, user.username, user.email);
		const refreshToken = generateRefreshToken(user.id, user.username, user.email);
		registerToken(refreshToken, accessToken);
		// 토큰 복호화해서 담겨있는 유저 정보 및 토큰 만료 정보도 함께 넘겨줌
		const decoded = verify(accessToken, process.env.SECRET_ATOKEN);

		res.cookie('refreshToken', refreshToken, { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 * 30 * 1000 });
		res.send({ content: decoded, accessToken });
	};

	static login = async (req: Request, res: Response) => {
		const { email, password } = req.body;

		// 가입된 유저인지 확인
		const user = await myDataBase.getRepository(User).findOne({
			where: { email },
		});

		// 가입된 유저가 아니면 400 리턴
		if (!user) {
			return res.status(400).send({ message: '이메일 또는 비밀번호를 다시 확인하세요.' });
		}

		// 가입된 유저면 비밀번호 확인
		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			return res.status(400).send({ message: '이메일 또는 비밀번호를 다시 확인하세요.' });
		}

		const accessToken = generateAccessToken(user.id, user.username, user.email);
		const refreshToken = generateRefreshToken(user.id, user.username, user.email);
		registerToken(refreshToken, accessToken);

		const decoded = verify(accessToken, process.env.SECRET_ATOKEN);
		res.cookie('refreshToken', refreshToken, {
			path: '/',
			httpOnly: true,
			maxAge: 3600 * 24 * 30 * 1000,
		});
		res.send({ content: decoded, accessToken });
	};

	static logout = async (req: Request, res: Response) => {
		const { refreshToken } = req.cookies;
		if (!refreshToken) {
			return res.status(400).send({ message: '로그인 상태가 아닙니다.' });
		}
		removeToken(refreshToken);
		res.clearCookie('refreshToken');
		res.send({ message: '로그아웃 되었습니다.' });
	};
}
