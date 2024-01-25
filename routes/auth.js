import express from 'express';
import * as authController from '../controllers/authController.js'
import * as refreshController from '../controllers/refershController.js'
import * as socialController from '../controllers/socialControllers.js'

const router = express.Router();

router.post('/auth', authController.handleLogin);

router.get('/refresh', refreshController.handleRefreshToken);

router.post('/gitlogin', socialController.gitLogin);

router.post('/gglogin', socialController.googleLogin)

export default router;