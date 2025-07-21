import express from 'express'
import routes from '../api/Users'

const route = express.Router();

route.use('/users', routes);

export default route;
