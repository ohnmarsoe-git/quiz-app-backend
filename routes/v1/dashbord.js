import express from 'express';
import * as controllers from '../../controllers/dashboardControllers.js'

const router = express.Router();

router.get('/', controllers.getAll);

export default router;

