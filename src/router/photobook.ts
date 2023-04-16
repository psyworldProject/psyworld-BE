import { Router } from 'express';
import { PhotobookController } from '../controller/PhotobookController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { upload } from '../middleware/uploadS3';

const routes = Router();

routes.get('', PhotobookController.getPhotobooks);
routes.post('', upload.single('image'), AuthMiddleware.verifyToken, PhotobookController.createPhotobook);
routes.post('/:id/comment', AuthMiddleware.verifyToken, PhotobookController.createComment);
routes.put('/:id/comment/:commentId', AuthMiddleware.verifyToken, PhotobookController.updateComment);
routes.delete('/:id/comment/:commentId', AuthMiddleware.verifyToken, PhotobookController.deleteComment);
routes.post('/:id', AuthMiddleware.verifyToken, PhotobookController.likePost);
routes.get('/:id', PhotobookController.getPhotobook);
routes.put('/:id', upload.single('image'), AuthMiddleware.verifyToken, PhotobookController.updatePhotobook);
routes.delete('/:id', AuthMiddleware.verifyToken, PhotobookController.deletePhotobook);
export default routes;
