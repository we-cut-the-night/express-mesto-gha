const NotFoundErr = require('../errors/404-not-found-err');
const BadReqErr = require('../errors/400-bad-req-err');

module.exports.handleError = (res, err, next) => {
  if (err.message === 'notFoundErr') {
    next(new NotFoundErr('По запросу ничего не найдено'));
    return;
  }
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    next(new BadReqErr('Переданы некорректные данные'));
    return;
  } next(err);
};
