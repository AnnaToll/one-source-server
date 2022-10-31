const testFunction = (a, b) => a * b;

test('Multiplies two arguments', () => {
    expect(testFunction(2, 3)).toBe(6);
});
require('dotenv').config();
const mockingoose = require('mockingoose');
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/user');
const assert = require('assert');

describe('GET /api/v0/users', () => {
    const users = [
        {
            name: 'Johanna',
            email: 'hanna@mail.com',
            phone: '+46701231234',
            pwd: '123',
            accessLevel: 'developer',
            image: 'Johanna.jpeg'
        },
        {
            name: 'Anna',
            email: 'anna@mail.com',
            phone: '+46704564567',
            pwd: '123',
            accessLevel: 'developer',
            image: 'Anna.jpeg'
        },
    ]
    beforeEach(() => {
        mockingoose.resetAll();
    });

    it('Should return list of users without pwd', async () => {
        mockingoose(User).toReturn(users, 'find');
        return request(app)

            .get('/api/v0/users')
            .send(users)
            .expect(200)
            .expect('Content-type', 'application/json; charset=utf-8')
            .then((res) => {
                // console.log('test', res)
                const array = res.body
                const employee = array.find(employee => employee.hasOwnProperty('pwd'))
                console.log('employee', employee);
                assert(employee === undefined);
            })
    });

    // //     it('Should not register empty user', async () => {
    // //         mockingoose(User).toReturn([], 'find');

    // //         return request(app)
    // //             .post('/api/v0/register')
    // //             .send({})
    // //             .expect(500)
    // //     });
});
