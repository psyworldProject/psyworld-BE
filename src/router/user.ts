import { Router } from 'express';
import { UserController } from '../controller/UserController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = Router();

router.get('/:id/following', UserController.getFollowings);
router.get('/:id/follower', UserController.getFollowers);
router.post('/:id/follow', AuthMiddleware.verifyToken, UserController.followUser);

export default router;
