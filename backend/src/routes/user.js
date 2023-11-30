const express = require('express');
const UserController = require('../controllers/user');
const validateToken = require('./validate-token');

const router = express.Router();

router.post('/login', UserController.loginUser);

router.post('/create-user', validateToken, UserController.createUser);
router.get('/users', validateToken, UserController.getUsers);
router.get('/user/:id', validateToken, UserController.getUser);
router.get('/user-owner/:token', validateToken, UserController.getUserByOwner);
router.put('/user-password/:id', validateToken, UserController.changeUserPassword);
router.put('/user-owner/:id', validateToken, UserController.updateUserByOwner);
router.put('/user/:id', validateToken, UserController.updateUser);
router.delete('/user/:id', validateToken, UserController.deleteUser);

module.exports = router;