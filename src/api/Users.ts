import express from 'express'
import createUser from '../controller/createUserController'
import UserDataValidation from '../middleware/UserDataValidation';
import fetchUsers from '../controller/fetchUserController';
import authUser from '../controller/authUserController';
import deleteUser from '../controller/deleteUserController';

const route = express.Router();

route.post('/create', UserDataValidation, createUser);
route.post('/auth', authUser);
route.get('/fetch', fetchUsers);
route.delete('/destroy', deleteUser);

export default route;