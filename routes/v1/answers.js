import express from 'express';
import * as controllers from '../../controllers/answerControllers.js'

const router = express.Router();

router.get('/', controllers.getAll);

router.get('/latest', controllers.getAllAns);

router.get('/latest/:id', controllers.getAllAns);

router.get('/history/:id', controllers.getByUser);

router.get('/:id', controllers.getOne);

router.post('/', controllers.createNew);

router.patch('/:id', controllers.updateOne);

router.delete('/:id', controllers.deleteOne);

export default router;

