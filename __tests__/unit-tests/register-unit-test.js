require('dotenv').config();
const mockingoose = require('mockingoose');
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/user');

const randomNr = Math.floor(Math.random() * 1000000) + 1;

describe('POST /api/v0/register', () => {
  const newUser = {
    name: 'Hannatest',
    email: `hanna${randomNr}@mail.com`,
    phone: '+46703344555',
    pwd: 'hejhej',
    accessLevel: 'developer',
  };
  beforeEach(() => {
    mockingoose.resetAll();

  });

  it('Should register new user', async () => {
    mockingoose(User).toReturn([], 'find');
    return request(app)
      .post('/api/v0/register')
      .send(newUser)
      .expect(200)
      .expect('Content-type', 'application/json; charset=utf-8')
  });

  it('Should not register new user', async () => {
    mockingoose(User).toReturn([newUser], 'find');

    return request(app)
      .post('/api/v0/register')
      .send(newUser)
      .expect(409)
  });

  it('Should not register empty user', async () => {
    mockingoose(User).toReturn([], 'find');
    // mockingoose(User).toReturn(new Error(), 'save');

    return request(app)
      .post('/api/v0/register')
      .send({})
      .expect(500)
  });
});
