import { Router } from 'express';
import { GuestbookController } from '../controller/GuestbookController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const routes = Router();

routes.get('', GuestbookController.getGuestbook);
routes.post('', AuthMiddleware.verifyToken, GuestbookController.createGuestbook);
routes.put('/:id', AuthMiddleware.verifyToken, GuestbookController.updateGuestbook);

export default routes;
