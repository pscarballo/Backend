import express from 'express';
export const passwRecoverRouter = express.Router();
import { logger } from '../utils/main.js';
import { passwRecoverController } from '../controllers/passwRecover.controller.js';

passwRecoverRouter.get('/', async (req, res) => {
  try {
    const title = 'Jordans Closet®';
    return res.status(200).render('recovery', { title });
  } catch (e) {
    logger.error(e.message);
    res.status(501).send({ status: 'error', msg: 'Error en el servidor', error: e });
  }
});
passwRecoverRouter.post('/', passwRecoverController.sendEmail);
passwRecoverRouter.get('/pass', passwRecoverController.findToken);
passwRecoverRouter.post('/pass', passwRecoverController.newPassword);
