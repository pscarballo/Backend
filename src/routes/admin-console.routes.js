import express from 'express';
export const adminConsole = express.Router();
import { logger } from '../utils/main.js';

// console.get('/', async (req, res) => {
//   try {
//     // const title = 'JORDAN®';
//     // const { firstName, lastName, role } = req.session.user;
//     // return res.status(200).render('home', { title, firstName, lastName, role });
//   } catch (e) {
//     logger.error(e);
//     res.status(501).send({ status: 'error', msg: 'Error en el servidor', error: e });
//   }
// });
