import { Router } from 'express';
import { GuestbookController } from '../controller/GuestbookController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const routes = Router();
routes.delete('/:id/comment/:commentId', AuthMiddleware.verifyToken, GuestbookController.deleteComment);
routes.put('/:id/comment/:commentId', AuthMiddleware.verifyToken, GuestbookController.updateComment);
routes.post('/:id', AuthMiddleware.verifyToken, GuestbookController.createComment);
routes.put('/:id', AuthMiddleware.verifyToken, GuestbookController.updateGuestbook);
routes.delete('/:id', AuthMiddleware.verifyToken, GuestbookController.deleteGuestbook);
routes.post('', AuthMiddleware.verifyToken, GuestbookController.createGuestbook);
routes.get('', GuestbookController.getGuestbookbyOwnerId);
export default routes;
