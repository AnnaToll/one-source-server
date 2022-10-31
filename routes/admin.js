const routes = require('express').Router({});
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { verifyToken } = require('../jwt');
const { activateChat, closeChat, setKey } = require('../socket');

routes.get('/delete-cookies', verifyToken, (req, res) => {
    if (req.cookies?.jwt) {
        for (let cookie of Object.keys(req.cookies)) {
            res.clearCookie(cookie);
        }
    }
    res.send();
});

routes.patch('/add-access', verifyToken, async (req, res) => {
    console.log('in add access');   
    const accessLevel = req.body.accessLevel;
    let newAccessArr = [];
    try {
        const doc = await User.find({email: req.body.email});
        const user = doc[0];
        if (user === undefined) {
            return res.status(401).send({ error: 'Email is not registered' });
        }
        if (user.accessLevel.includes(accessLevel)) {
            return res.status(401).send({ error: 'User already has access' });
        }
        if (typeof user.accessLevel === 'string') {
            newAccessArr = [user.accessLevel];
        } else {
            newAccessArr = [...user.accessLevel];
        }
        newAccessArr.push(accessLevel);
        newAccessArr.sort(); 
    } catch (err) {
        console.log(err);
    }
    try {
        await User.findOneAndUpdate({email: req.body.email}, {accessLevel: newAccessArr});
    } catch (err) {
        console.log(err);
    }
    res.status(200);
    res.send({success: 'Access level successfully added' });

});

routes.patch('/remove-access', verifyToken, async (req, res) => {
    console.log('in remove access');
    const accessLevel = req.body.accessLevel;
    let newAccessArr = [];
    try {
        const doc = await User.find({email: req.body.email});
        const user = doc[0];
        if (user === undefined) {
            return res.status(401).send({ error: 'Email is not registered' });
        }
        if (!user.accessLevel.includes(accessLevel)) {
            return res.status(401).send({ error: `User did not have access type ${accessLevel}` });
        }
        if (typeof user.accessLevel === 'object') {
            newAccessArr = user.accessLevel.filter(type => type !== accessLevel);
        }
    } catch (err) {
        console.log(err);
    }
    try {
        await User.findOneAndUpdate({email: req.body.email}, {accessLevel: newAccessArr});
    } catch (err) {
        console.log(err);
    }
    res.status(200);
    res.send({success: 'Access level successfully removed' });

});

routes.get('/activate-chat', verifyToken, (req, res) => {
    const key = Math.floor(Math.random() * 10000000000);
    setKey(key);
    res.status(200).send({ key: key });
});

routes.get('/close-chat', verifyToken, (req, res) => {
    // closeChat();
    res.status(200).send();
});

module.exports = routes;