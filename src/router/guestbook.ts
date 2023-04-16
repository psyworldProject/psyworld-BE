import { Router } from 'express';
import { GuestbookController } from '../controller/GuestbookController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = Router();
router.delete('/comment/:commentId', AuthMiddleware.verifyToken, GuestbookController.deleteComment);
router.put('/comment/:commentId', AuthMiddleware.verifyToken, GuestbookController.updateComment);
router.post('/:id/comment', AuthMiddleware.verifyToken, GuestbookController.createComment);
router.put('/:id', AuthMiddleware.verifyToken, GuestbookController.updateGuestbook);
router.delete('/:id', AuthMiddleware.verifyToken, GuestbookController.deleteGuestbook);
router.post('', AuthMiddleware.verifyToken, GuestbookController.createGuestbook);
router.get('', GuestbookController.getGuestbookbyOwnerId);
export default router;
