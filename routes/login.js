const routes = require('express').Router({});
require('dotenv').config();
const User = require('../models/user');
const { generateJwtToken, checkCookie, cookieSettings } = require('../jwt');

// const authorizeUser = "/api/v0/authorize";

/**
 * @openapi
 * /api/v0/authorize:
 *   post:
 *     tags:
 *     - users
 *     summary: Authorize user
 *     description: Check if email and password provided by user matches
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
 *       401:
 *         description: Email not registred or does not match password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message
 *                   example: Email not registered.
 */

routes.post('/', checkCookie, (req, res) => {
  User.find()
    .then((result) => {
      const user = result.find((element) => element.email === req.body.email);
      if (user) {
        if (user.pwd === req.body.pwd) {
          res.status(200);
          const tokenPayload = { 
            name: user.name, 
            accessLevel: user.accessLevel 
          };
          const accessToken = generateJwtToken(tokenPayload, 'access');
          const refreshToken = generateJwtToken(tokenPayload, 'refresh');
          res.cookie(
              'jwt',
              refreshToken, 
              cookieSettings
          );
          res.send({ accessToken: accessToken });
        } else {
          res.status(401);
          res.send({ error: 'Password and email do not match.' });
        }
      } else {
        res.status(401);
        res.send({ error: 'Email not registered.' });
      }
    })
    .catch((err) => console.log(err));
});

module.exports = routes;
