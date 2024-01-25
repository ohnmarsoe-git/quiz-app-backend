import express from 'express';
import * as controllers from '../../controllers/quizControllers.js'

const router = express.Router();

router.get('/', controllers.getAll);

router.get('/count', controllers.getAllCount);

router.get('/groupby', controllers.getByCategory);

router.get('/:id', controllers.getOne);

router.post('/', controllers.createNew);

router.patch('/:id', controllers.updateOne);

router.delete('/:id', controllers.deleteOne);

router.post('/filterby', controllers.getCategoryLevel);

router.post('/filterbyuser', controllers.getFilterByUser);

export default router;

