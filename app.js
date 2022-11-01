const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const cookieparser = require('cookie-parser');
const swaggerOptions = require('./swagger.json');
const { authenticateToken, generateJwtToken } = require('./jwt');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const registerRoute = require('./routes/register.js');
const userRoute = require('./routes/users.js');
const loginRoute = require('./routes/login.js');
const refreshRoute = require('./routes/refresh');
const logoutRoute = require('./routes/logout');
const adminRoute = require('./routes/admin');

const corsOrigin = [
    'http://localhost:3000',
    'https://one-source-app.herokuapp.com'
];

const app = express();

app.use(cors({ 
    credentials: true, 
    origin: corsOrigin
}));
app.use(express.json());
app.use(cookieparser());

const swaggerDocument = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v0/register', registerRoute);
app.use('/api/v0/users', userRoute);
app.use('/api/v0/authorize', loginRoute);
app.use('/api/v0/refresh', refreshRoute);
app.use('/api/v0/logout', logoutRoute);
app.use('/api/v0/admin', adminRoute);

module.exports = app;
module.exports.corsOrigin = corsOrigin;
