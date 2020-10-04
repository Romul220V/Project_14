/* eslint-disable linebreak-style */
const router = require('express').Router();
const { getUsers, getUsersId, createUser } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUsersId);
router.post('/users', createUser);
module.exports = router;
