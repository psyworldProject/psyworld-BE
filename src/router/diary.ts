import { Router } from 'express';
import { DiaryController } from '../controller/DiaryController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = Router();

router.get('', DiaryController.getDiaries);
router.post('', AuthMiddleware.verifyToken, DiaryController.createDiary);
router.get('/:id', DiaryController.getDiary);
router.put('/:id', AuthMiddleware.verifyToken, DiaryController.updateDiary);
router.delete('/:id', AuthMiddleware.verifyToken, DiaryController.deleteDiary);
router.post('/:id/comment', AuthMiddleware.verifyToken, DiaryController.createComment);
router.put('/comment/:commentId', AuthMiddleware.verifyToken, DiaryController.updateComment);
router.delete('/comment/:commentId', AuthMiddleware.verifyToken, DiaryController.deleteComment);
export default router;
