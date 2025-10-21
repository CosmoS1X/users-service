import request from 'supertest';
import app from '../../src';
import { User } from '../../src/models';
import { createUserData } from '../helpers';
import Endpoints from '../endpoints';

describe('Auth controller', () => {
  let testUser: User;
  let credentials: { email: string; password: string };
  let agent: request.Agent;

  beforeEach(async () => {
    const userData = createUserData();
    credentials = { email: userData.email, password: userData.password };
    testUser = await User.query().insert(userData);
    agent = request.agent(app);
  });

  afterEach(async () => {
    await User.query().delete();
  });

  describe(`POST ${Endpoints.Login}`, () => {
    it('should login with correct credentials', async () => {
      const response = await request(app).post(Endpoints.Login).send(credentials);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(testUser.email);
    });

    it('should not login with incorrect email', async () => {
      const response = await request(app)
        .post(Endpoints.Login)
        .send({ ...credentials, email: 'wrong@example.com' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('User with this email not found');
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post(Endpoints.Login)
        .send({ ...credentials, password: 'wrong_password' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid password');
    });

    it('should not login with inactive user', async () => {
      const inactiveUserData = createUserData();
      const inactiveCredentials = {
        email: inactiveUserData.email,
        password: inactiveUserData.password,
      };

      await User.query().insert({ ...inactiveUserData, isActive: false });

      const response = await request(app).post(Endpoints.Login).send(inactiveCredentials);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Forbidden');
      expect(response.body.message).toBe('Access denied');
    });

    it('should set session cookie on successful login', async () => {
      const response = await request(app).post(Endpoints.Login).send(credentials);

      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toBeDefined();
    });
  });

  describe(`GET ${Endpoints.CheckAuth}`, () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app).get(Endpoints.CheckAuth);

      expect(response.status).toBe(401);
    });

    it('should return user data when authenticated', async () => {
      await agent.post(Endpoints.Login).send(credentials);

      const response = await agent.get(Endpoints.CheckAuth);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(testUser.email);
    });
  });

  describe(`POST ${Endpoints.Logout}`, () => {
    it('should logout and clear session', async () => {
      await agent.post(Endpoints.Login).send(credentials);

      const checkAuthResponse = await agent.get(Endpoints.CheckAuth);
      expect(checkAuthResponse.status).toBe(200);

      const logoutResponse = await agent.post(Endpoints.Logout);
      expect(logoutResponse.status).toBe(204);

      const newCheckAuthResponse = await agent.get(Endpoints.CheckAuth);
      expect(newCheckAuthResponse.status).toBe(401);
    });
  });

  describe('Session persistence', () => {
    it('should maintain session across requests', async () => {
      await agent.post(Endpoints.Login).send(credentials);

      const response1 = await agent.get(Endpoints.CheckAuth);
      const response2 = await agent.get(Endpoints.CheckAuth);

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
    });
  });
});
