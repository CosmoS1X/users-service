import request from 'supertest';
import app from '../../src';
import { User } from '../../src/models';
import { createUserData, getUserPath } from '../helpers';
import Endpoints from '../endpoints';

type Credentials = {
  email: string;
  password: string;
};

type Role = 'admin' | 'user';

describe('Users controller', () => {
  let testUser: User;
  let userCredentials: Credentials;
  let adminCredentials: Credentials;
  let agent: request.Agent;

  beforeEach(async () => {
    const userData = createUserData();
    const adminData = { ...createUserData(), role: 'admin' as Role };
    userCredentials = { email: userData.email, password: userData.password };
    adminCredentials = { email: adminData.email, password: adminData.password };
    agent = request.agent(app);
    testUser = await User.query().insert(userData);
    await User.query().insert(adminData);
  });

  afterEach(async () => {
    await User.query().delete();
  });

  describe(`GET ${Endpoints.Users}`, () => {
    it('should deny access to unauthorized users', async () => {
      const response = await request(app).get(Endpoints.Users);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied');
    });

    it('should return list of users to admin', async () => {
      await agent.post(Endpoints.Login).send(adminCredentials);

      const response = await agent.get(Endpoints.Users);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });

  describe(`POST ${Endpoints.Users}`, () => {
    it('should create a new user', async () => {
      const newUserData = createUserData();
      const response = await request(app).post(Endpoints.Users).send(newUserData);

      expect(response.status).toBe(201);
      expect(response.body.email).toBe(newUserData.email);
    });

    it('should not allow duplicate emails', async () => {
      const userWithSameEmail = { ...createUserData(), email: testUser.email };
      const response = await request(app).post(Endpoints.Users).send(userWithSameEmail);

      expect(response.status).toBe(409);
    });
  });

  describe(`GET ${Endpoints.User}`, () => {
    it('should return 403 if user tries to access another user', async () => {
      const anotherUserData = createUserData();
      const anotherUser = await User.query().insert(anotherUserData);

      await agent.post(Endpoints.Login).send(userCredentials);

      const response = await agent.get(getUserPath(anotherUser.id));

      expect(response.status).toBe(403);
    });

    it('should return user if owner', async () => {
      await agent.post(Endpoints.Login).send(userCredentials);

      const response = await agent.get(getUserPath(testUser.id));

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testUser.id);
    });

    it('should return user if admin', async () => {
      await agent.post(Endpoints.Login).send(adminCredentials);

      const response = await agent.get(getUserPath(testUser.id));

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testUser.id);
    });

    it('should return 404 if user not found', async () => {
      await agent.post(Endpoints.Login).send(adminCredentials);

      const response = await agent.get(getUserPath(9999));

      expect(response.status).toBe(404);
    });
  });

  describe(`PATCH ${Endpoints.User}/block`, () => {
    it('should block user by admin', async () => {
      await agent.post(Endpoints.Login).send(adminCredentials);

      const response = await agent.patch(`${getUserPath(testUser.id)}/block`);

      expect(response.status).toBe(200);

      const blockedUser = await User.query().findById(testUser.id);

      expect(blockedUser?.isActive).toBeFalsy();
    });

    it('should block user by self', async () => {
      await agent.post(Endpoints.Login).send(userCredentials);

      const response = await agent.patch(`${getUserPath(testUser.id)}/block`);

      expect(response.status).toBe(200);

      const blockedUser = await User.query().findById(testUser.id);

      expect(blockedUser?.isActive).toBeFalsy();
    });

    it('should return 403 if user tries to block another user', async () => {
      const anotherUserData = createUserData();
      const anotherUser = await User.query().insert(anotherUserData);

      await agent.post(Endpoints.Login).send(userCredentials);

      const response = await agent.patch(`${getUserPath(anotherUser.id)}/block`);

      expect(response.status).toBe(403);
    });

    it('should return 404 if user not found', async () => {
      await agent.post(Endpoints.Login).send(adminCredentials);

      const response = await agent.patch(`${getUserPath(9999)}/block`);

      expect(response.status).toBe(404);
    });
  });
});
