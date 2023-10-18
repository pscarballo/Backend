import { cartService } from '../services/carts.service.js';
import { ticketService } from '../services/tickets.service.js';
import Errors from '../services/errors/enums.js';
import { logger } from '../utils/main.js';

export function checkLogin(req, res, next) {
  try {
    if (req.session?.user?.firstName) {
      return next();
    }
  } catch (e) {
    logger.error(e);
    const isLogin = 'Please Login';
    return res.status(201).render('error', { isLogin });
  }
}

export function checkAdmin(req, res, next) {
  if (req.session?.user?.role == 'admin') {
    return next();
  } else {
    const isAdmin = 'You must be Admin';
    return res.status(201).render('error', { isAdmin });
  }
}

export function checkUser(req, res, next) {
  if (req.session?.user?.role == 'user') {
    return next();
  } else {
    logger.error('You must be User');
    const isUser = 'You must be User';
    return res.status(201).render('error', { isUser });
  }
}

export function checkPremium(req, res, next) {
  if (req.session?.user?.premium == 'true') {
    return next();
  } else {
    logger.error('You must be Premium User');
    const isPremium = 'You must be Premium User';
    return res.status(201).render('error', { isPremium });
  }
}

export async function checkCart(req, res, next) {
  const cartUser = req.session.user.cartId;
  const cartParams = req.params.cid;
  if (cartUser == cartParams) {
    return next();
  } else {
    const notCart = 'Wrong User cart ';
    return res.status(500).render('error', { notCart });
  }
}

export async function checkTicket(req, res, next) {
  const user = req.session.user;
  const cart = await cartService.readById(user.cartId);
  const tickets = await ticketService.readAll(cart._id);
  if (cart == tickets) {
    return next();
  } else {
    const notCart = 'Wrong User';
    return res.status(500).render('error', { notCart });
  }
}

export function errorHandler(error, req, res, next) {
  logger.error(error);

  switch (error.code) {
    case Errors.ROUTING_ERROR:
      const notFound = 'Not Found';
      return res.status(404).render('error', { notFound });
    case Errors.ID_ERROR:
      const errorId = 'Wrong ID';
      return res.status(404).render('error', { errorId });
    default:
      res.status(500).send({ status: 'error', error: 'Unhandled error' });
      break;
  }
}
