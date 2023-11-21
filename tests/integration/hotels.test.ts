import supertest from 'supertest';
import app from '@/app';
import { prisma } from '@/config';
import * as jwt from 'jsonwebtoken';
import { createUser } from '../factories';

const request = supertest(app);

describe('Hotels Endpoint', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return 401 if given token is not valid', async () => {
    const response = await request.get('/hotels').set('Authorization', 'Bearer invalidToken');
    expect(response.status).toBe(401);
  });

  it('should return 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await request.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(401);
  });

});
