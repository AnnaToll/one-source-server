const routes = require('express').Router({});
const jwt = require('jsonwebtoken');
const { generateJwtToken } = require('../jwt');


routes.get('/', (req, res) => {
    if (!req.cookies?.jwt) {
        res.status(401);
    } else {
        const refreshToken = req.cookies.jwt;
        console.log('in refreshtoken');

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(406);
            } else {
                const tokenPayload = {
                    name: decoded.name,
                    accessLevel: decoded.accessLevel
                };
                const accessToken = generateJwtToken(tokenPayload, 'access');
                res.status(200);
                res.send({ accessToken: accessToken });
            }
        });
    }

});

module.exports = routes;