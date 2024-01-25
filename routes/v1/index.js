import express from 'express';
import user from './user.js'
import quiz from './quiz.js'
import dashboard from './dashbord.js'
import answers from './answers.js'
import category from './category.js'

const router = express.Router();

router.use('/users', user);

router.use('/quiz', quiz);

router.use('/dashboard', dashboard);

router.use('/answers', answers);

router.use('/category', category);

export default router;
