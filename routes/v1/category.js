import express from 'express';
import * as categorycontrollers from '../../controllers/categoryContorllers.js'

const router = express.Router();

//category route => /api/v1/category/

router.get('/', categorycontrollers.getAllCategory);

router.get('/:id', categorycontrollers.getOne);

router.post('/', categorycontrollers.createNew);

router.patch('/:id', categorycontrollers.updateOne);

router.delete('/:id', categorycontrollers.deleteOne);

export default router;