import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotels, getHotelsById } from '@/controllers/hotels-controller';
const hotelsRouter = Router();

hotelsRouter
  .all('/*', authenticateToken)
  .get('/', getHotels)
  .get('/:hotelId', getHotelsById)

export { hotelsRouter };