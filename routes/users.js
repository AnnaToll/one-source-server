const routes = require('express').Router({});
require('dotenv').config();
const User = require('../models/user');

// const allUsers = "/api/v0/users";

/**
 * @openapi
 * /api/v0/users:
 *   get:
 *     tags:
 *     - users
 *     summary: Retrieve a list of all users
 *     description: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The employee ID
 *                         example: 0
 *                       name:
 *                         type: string
 *                         description: The user's name
 *                         example: Nilla
 *                       email:
 *                         type: string
 *                         description: The user's email
 *                         example: name@mail.com
 *                       phone:
 *                         type: string
 *                         description: The user's phone number
 *                         example: +46701231231
 */

routes.get('/', (req, res) => {
  User.find()
    .then((result) => {
      // console.log('mockad users', result);
      const employees = result.map((employee) => ({
        id: employee.id, name: employee.name, email: employee.email, phone: employee.phone, accessLevel: employee.accessLevel, image: employee.image,
      }));
      res.send(employees);
      // console.log('employees', employees);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send();
    });
});

module.exports = routes;
