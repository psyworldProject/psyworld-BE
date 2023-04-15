import { Router } from 'express';
import { UserController } from '../controller/UserController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { upload } from '../uploadS3';

const routes = Router();

routes.post('/register', UserController.register);
routes.post('/check', UserController.checkDuplicate);
routes.post('/login', UserController.login);
routes.post('/logout', UserController.logout);
routes.delete('/withdrawel', AuthMiddleware.verifyToken, UserController.withdrawel);
routes.put('/:id', upload.single('image'), AuthMiddleware.verifyToken, UserController.updateProfile);
routes.get('/:id', UserController.getUser);
routes.get('', UserController.getUsers);
export default routes;
