import { Request } from "express";
import multer from "multer";

interface DestinationCallback {
  (error: Error | null, destination: string): void;
}
interface FileNameCallback {
  (error: Error | null, filename: string): void;
}

export const upload = multer({
  storage: multer.diskStorage({
    destination: function (
      req: Request,
      file: Express.Multer.File,
      cb: DestinationCallback
    ) {
      cb(null, "./uploads/");
    }, // 업로드 경로를 지정
    filename: function (
      req: Request,
      file: Express.Multer.File,
      cb: FileNameCallback
    ) {
      cb(null, Date.now() + "-" + file.originalname);
    }, // 파일명을 지정 (중복을 방지하기 위해 시간 값을 추가)
  }),
});
