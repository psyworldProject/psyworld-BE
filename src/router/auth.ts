import { Router } from 'express';
import { UserController } from '../controller/UserController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { upload } from '../uploadS3';

const routes = Router();

routes.get('', AuthMiddleware.verifyToken, UserController.getUsers);
routes.post('/register', UserController.register);
routes.post('/check', UserController.checkDuplicate);
routes.post('/login', UserController.login);
routes.post('/logout', UserController.logout);
routes.delete('/withdrawel', AuthMiddleware.verifyToken, UserController.withdrawel);
routes.put('/:id', upload.single('image'), AuthMiddleware.verifyToken, UserController.updateProfile);
// routes.get('/:id', AuthMiddleware.verifyToken, UserController.getUser);
export default routes;
