const routes = require('express').Router({});
require('dotenv').config();
const User = require('../models/user');
const { generateJwtToken, checkCookie, cookieSettings } = require('../jwt');

// const registerUser = "/api/v0/register";

/**
 * @openapi
 * /api/v0/register:
 *   post:
 *     tags:
 *     - users
 *     summary: Register user
 *     description: Registers user to database
 *     responses:
 *       200:
 *         description: The user's details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name of user
 *                   example: Isabelle
 *                 email:
 *                   type: string
 *                   description: Email to user
 *                   example: isabelle@mail.com
 *                 phone:
 *                   type: string
 *                   description: Phone number to user
 *                   example: +46 123 789 78
 *                 pwd:
 *                   type: string
 *                   description: Password to account
 *                   example: SuperSecretPassword
 *                 accessLevel:
 *                   type: string
 *                   description: Access level
 *                   example: Developer
 *       409:
 *         description: Email is already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message
 *                   example: Email is already registered.
 */

routes.post('/', checkCookie, (req, res) => {
    console.log(req.body);
  User.find()
    .then(async (result) => {
        // console.log('mockad array', result);
      const user = result.find((element) => element.email === req.body.email);
      // console.log('user', user);
      if (user) {
        res.status(409);
        res.send({ error: 'Email is already registered.' });
      } else {
        const newUser = new User({ ...req.body, accessLevel: [] });
        await newUser.save();
        const tokenPayload = { 
          name: newUser.name, 
          accessLevel: newUser.accessLevel 
        };
        const accessToken = generateJwtToken(tokenPayload, 'access');
        const refreshToken = generateJwtToken(tokenPayload, 'refresh');
        res.cookie(
            'jwt',
            refreshToken,
            cookieSettings
        );
        res.send({ accessToken: accessToken });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send();
    });
});

module.exports = routes;
