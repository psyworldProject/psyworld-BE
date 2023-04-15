import { Router } from 'express';
import { UserController } from '../controller/UserController';

const routes = Router();

routes.post('/register', UserController.register);

export default routes;
