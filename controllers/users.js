const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUsersId = (req, res) => {
  User.find({ _id: req.params.userId })
    .orFail(new Error('WrongId'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'WrongId') {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
      } else { res.status(500).send({ message: 'Ошибка сервера' }); }
    });
};

module.exports.createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};
