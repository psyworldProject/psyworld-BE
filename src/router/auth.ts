import { Router } from 'express';
import { UserController } from '../controller/UserController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { upload } from '../middleware/uploadS3';

const router = Router();

router.post('/register', upload.single('image'), UserController.register);
router.post('/check', UserController.checkDuplicate);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.delete('/withdrawel', AuthMiddleware.verifyToken, UserController.withdrawel);
router.put('/:id', upload.single('image'), AuthMiddleware.verifyToken, UserController.updateProfile);
router.get('/:id', UserController.getUser);
router.get('', UserController.getUsers);
export default router;
