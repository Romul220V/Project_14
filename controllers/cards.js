const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.delCardId = (req, res) => {
  Card.findOneAndRemove({ _id: req.params.cardId })
    .orFail(new Error('WrongId'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'WrongId') {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
      } else { res.status(500).send({ message: 'Ошибка сервера' }); }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};
