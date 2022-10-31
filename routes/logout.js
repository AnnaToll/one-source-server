const routes = require('express').Router({});

routes.get('/', (req, res) => {
    if (req.cookies?.jwt) {
        res.clearCookie('jwt');
    }
    res.send();
});

module.exports = routes;