import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services/hotels-service';
import { Response } from 'express';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const result = await hotelsService.getHotels(userId);
    res.status(200).json(result);
}

export async function getHotelsById(req: AuthenticatedRequest, res: Response) {
    const hotelId = parseInt(req.params.hotelId, 10);
    const result = await hotelsService.getHotelsById(hotelId);
    res.status(200).json(result);
}