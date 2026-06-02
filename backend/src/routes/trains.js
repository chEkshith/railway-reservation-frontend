import express from 'express';
import { searchTrains, getStations } from '../controllers/trainController.js';

const router = express.Router();

router.get('/search', searchTrains);
router.get('/stations', getStations);

export default router;
