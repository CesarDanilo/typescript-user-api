import express from 'express'
import createUser from '../controller/createUserController'
import UserDataValidation from '../middleware/UserDataValidation';
import fetchUsers from '../controller/fetchUserController';

const route = express.Router();

route.post('/create', UserDataValidation, createUser);
route.get('/fetch', fetchUsers);

export default route;