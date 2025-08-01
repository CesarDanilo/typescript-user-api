import express from 'express'
import route from '../api/Users'

const mainRoute = express.Router();

mainRoute.use('/users', route);

export default mainRoute;
