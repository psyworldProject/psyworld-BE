import { Router } from 'express';
import { PhotobookController } from '../controller/PhotobookController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { upload } from '../middleware/uploadS3';

const router = Router();

router.get('', PhotobookController.getPhotobooks);
router.post('', upload.single('image'), AuthMiddleware.verifyToken, PhotobookController.createPhotobook);
router.post('/:id/comment', AuthMiddleware.verifyToken, PhotobookController.createComment);
router.put('/comment/:commentId', AuthMiddleware.verifyToken, PhotobookController.updateComment);
router.delete('/comment/:commentId', AuthMiddleware.verifyToken, PhotobookController.deleteComment);
router.post('/:id', AuthMiddleware.verifyToken, PhotobookController.likePost);
router.get('/:id', PhotobookController.getPhotobook);
router.put('/:id', upload.single('image'), AuthMiddleware.verifyToken, PhotobookController.updatePhotobook);
router.delete('/:id', AuthMiddleware.verifyToken, PhotobookController.deletePhotobook);
export default router;
