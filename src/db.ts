import { DataSource } from 'typeorm';

export const myDataBase = new DataSource({
	type: 'mysql',
	host: '',
	port: 3306,
	username: 'admin',
	password: 'admin123',
	database: 'mydb', // db 이름
	entities: ['src/entity/*.ts'], // 모델의 경로
	logging: true, // 정확히 어떤 sql 쿼리가 실행됐는지 로그 출력
	synchronize: true, // 현재 entity 와 실제 데이터베이스 상 모델을 동기화
});
