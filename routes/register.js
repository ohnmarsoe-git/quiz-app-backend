import express from 'express';
import { handleRegister } from '../controllers/registerController.js';

const router = express.Router();

router.post('/register', handleRegister)

export default router;