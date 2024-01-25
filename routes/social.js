import express from 'express';
import * as socialControllers from '../controllers/socialControllers.js'

const router = express.Router();

router.post('/gitlogin', socialControllers.gitLogin);

router.post('/googlelogin', socialControllers.googleLogin);

export default router;