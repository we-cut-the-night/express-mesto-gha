module.exports.handleError = (res, err) => {
  if (err.message === 'notFoundErr') {
    res.status(404).send({ message: 'По запросу ничего не найдено' });
    return;
  }
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    res.status(400).send({ message: 'Переданы некорректные данные' });
    return;
  } res.status(500).send({ message: 'На сервере произошла ошибка' });
};
