require('dotenv').config();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/user');

const { dbURI } = process.env;
const randomNr = Math.floor(Math.random() * 1000000) + 1;

describe('POST /api/v0/register', () => {
  const newUser = {
    name: 'Hannatest',
    email: `hanna${randomNr}@mail.com`,
    phone: '+46703344555',
    pwd: 'hejhej',
    accessLevel: 'developer',
  };
  const newTestUser = {
    name: 'Obi',
    email: `obi${randomNr}@mail.com`,
    phone: '+46705566777',
    pwd: 'hejhej',
    accessLevel: 'developer',
  };
  beforeAll(async () => {
    mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await new User(newTestUser).save();
  });
  afterAll(async () => {
    console.log('In after all');
    const deleteNewUser = await User.deleteOne({ email: newUser.email });
    const findNewUserInDB = await User.find({ email: newUser.email }).exec();
    console.log('findNewUserInDB', findNewUserInDB);
    console.log('deleteNewUser', deleteNewUser);
    const deleteNewTestUser = await User.deleteOne({ email: newTestUser.email });
    const findNewTestUserInDB = await User.find({ email: newTestUser.email }).exec();
    console.log('findNewTestUserInDB', findNewTestUserInDB);
    console.log('deleteNewTestUser', deleteNewTestUser);
    await mongoose.disconnect();
  });

  it('Should register new user', async () => request(app)
    .post('/api/v0/register')
    .send(newUser)
    .expect(200)
    .expect('Content-type', 'application/json; charset=utf-8'));

  it('Should not register new user', async () => request(app)
    .post('/api/v0/register')
    .send(newTestUser)
    .expect(409));

  it('Should not register empty user', async () => request(app)
    .post('/api/v0/register')
    .send({})
    .expect(500));
});
