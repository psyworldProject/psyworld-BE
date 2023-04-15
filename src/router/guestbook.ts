import { Router } from 'express';
import { GuestbookController } from '../controller/GuestbookController';

const routes = Router();

routes.get('', GuestbookController.getGuestbook);

export default routes;
