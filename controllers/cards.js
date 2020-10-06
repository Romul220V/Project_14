const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.delCardId = (req, res) => {
  const { owner = req.user._id } = req.body;
  Card.findOne({ _id: req.params.cardId, owner })
    .orFail(new Error('WrongId'))
    .then((card) => {
      if (owner !== card.owner) {
        return Promise.reject(new Error('Вы не создатель этой карты и не можете удалить её'));
      }
      return Card.findOneAndRemove({ _id: req.params.cardId });
    })
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
