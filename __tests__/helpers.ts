import { faker } from '@faker-js/faker';
import Endpoints from './endpoints';

export const createUserData = () => ({
  fullName: faker.person.fullName(),
  birthDate: faker.date.birthdate().toISOString().split('T')[0],
  email: faker.internet.email().toLowerCase(),
  password: faker.internet.password({ length: 10 }),
});

export const getUserPath = (id: number) => `${Endpoints.Users}/${id}`;
