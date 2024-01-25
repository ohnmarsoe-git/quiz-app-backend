import express from 'express'
import * as controllers from '../../controllers/userControllers.js'

const router = express.Router();

router.get('/', controllers.getAll);

router.get('/:id', controllers.getOne);

router.patch('/:id', controllers.updateOne);

router.delete('/:id', controllers.deleteOne);

export default router;
