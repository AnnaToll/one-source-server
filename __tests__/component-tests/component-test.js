const testFunction = (a, b) => a * b;

test('Multiplies two arguments', () => {
  expect(testFunction(2, 3)).toBe(6);
});
require('dotenv').config();
const mongoose = require('mongoose');
const request = require('supertest');
const assert = require('assert');
const app = require('../../app');

const { dbURI } = process.env;
const PORT = process.env.PORT || 3001;

describe('POST /api/v0/authorize', () => {
  let server = null;
  beforeAll(() => {
    mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    server = app.listen(PORT);
    jest.setTimeout(10000);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await server.close();
  });
  test('Successful register', () => request(app)
    .post('/api/v0/authorize')
    .expect('Content-Type', /json/)
    .send({
      email: 'anna@mail.com',
      pwd: '123',
    })
    .expect(200)
    .then((res) => {
      assert(res.body.hasOwnProperty('accessToken'), true);
      assert(typeof res.body.accessToken, 'string');
      assert(Object.keys(res.body).length, 1);
    }));
  test('Unsuccessful authorization', () => request(app)
    .post('/api/v0/authorize')
    .expect('Content-Type', /json/)
    .send({
      email: 'anna@mail.com',
      pwd: '1234',
    })
    .expect(401)
    .then((res) => {
      assert(res.body.hasOwnProperty('error'), true);
      assert(typeof res.body.error, 'string');
      assert(Object.keys(res.body).length, 1);
    }));
});

// describe(`POST /api/v0/authorize`, () => {
//     let server = null
//     beforeAll(() => {
//         mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
//         server = app.listen(PORT, () => {
//             console.log(`Server running on port ${PORT}`)
//         });
//         });

//         afterAll( async () => {
//         await mongoose.disconnect()
//         await server.close()
//         });
//     test('Successful authorization', async () => {
//         try {
//             const res = await request(app)
//                 .post('/api/v0/authorize')
//                 // .expect('Content-Type', /json/)
//                 .send({
//                     email: "testar@test.se",
//                     pwd: "hejhej"
//                 })
//                 expect(response.status).toEqual(200);
//                 assert(res.body.hasOwnProperty('name'), true)
//                 assert(typeof res.body.name, 'string')
//                 assert(res.body.hasOwnProperty('email'), true)
//                 assert(typeof res.body.email, 'string')
//                 assert(res.body.hasOwnProperty('phone'), true)
//                 assert(typeof res.body.phone, 'string')
//                 assert(res.body.hasOwnProperty('pwd'), true)
//                 assert(typeof res.body.phone, 'string')
//                 assert(res.body.hasOwnProperty('accessLevel'), true)
//                 assert(typeof res.body.accessLevel, 'string')
//                 assert(Object.keys(res.body).length, 5)
//                 return done()

//         } catch (err) {
//             console.log(err)
//         }

//     });
//     test('Unsuccessful authorization', async () => {
//         try {
//             const res = await request(app)
//                 .post('/api/v0/authorize')
//                 // .expect('Content-Type', /json/)
//                 .send({
//                     email: "testar@test.se",
//                     pwd: "hejhej"
//                 })
//                 expect(response.status).toEqual(401);
//                 assert(res.body.hasOwnProperty('error'), true)
//                 assert(typeof res.body.error, 'string')
//                 assert(Object.keys(res.body).length, 1)
//                 return done()

//         } catch (err) {
//             console.log(err)
//         }
//     });
// });

// // describe(`POST ${process.env.registerUser}`, () => {
// //     test('Successful register', () => {
// //         return request(app)
// //             .post(process.env.registerUser)
// //             .expect('Content-Type', /json/)
// //             .send({
// //                 name: "testar@test.se",
// //                 pwd: "hejhej"
// //             })
// //             .expect(200)
// //             .then((res) => {
// //                 assert(res.body.hasOwnProperty('name'), true)
// //                 assert(typeof res.body.name, 'string')
// //                 assert(res.body.hasOwnProperty('email'), true)
// //                 assert(typeof res.body.email, 'string')
// //                 assert(res.body.hasOwnProperty('phone'), true)
// //                 assert(typeof res.body.phone, 'string')
// //                 assert(res.body.hasOwnProperty('pwd'), true)
// //                 assert(typeof res.body.phone, 'string')
// //                 assert(res.body.hasOwnProperty('accessLevel'), true)
// //                 assert(typeof res.body.accessLevel, 'string')
// //                 assert(Object.keys(res.body).length, 5)
// //             })

// //     });
// //     test('Unsuccessful authorization', () => {
// //         return request(app)
// //             .post(process.env.authorizeUser)
// //             .expect('Content-Type', /json/)
// //             .send({
// //                 email: "testar@test.se",
// //                 pwd: "hejhej1"
// //             })
// //             .expect(401)
// //             .then((res) => {
// //                 assert(res.body.hasOwnProperty('error'), true)
// //                 assert(typeof res.body.error, 'string')
// //                 assert(Object.keys(res.body).length, 1)
// //             })

// //     });
// // });
