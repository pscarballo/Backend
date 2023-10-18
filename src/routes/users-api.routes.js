import express from 'express';
export const usersApiRouter = express.Router();
import { usersController } from '../controllers/users.controller.js';
import { checkAdmin, checkPremium } from '../middlewares/main.js';

usersApiRouter.get('/', checkAdmin, usersController.read);
usersApiRouter.delete('/delete', usersController.deleteInactive);
usersApiRouter.get('/delUser/uid', checkAdmin, usersController.delUser);
usersApiRouter.get('/premium/:uid', checkPremium, usersController.premiumSwitch);
usersApiRouter.get('/adminConsole', checkAdmin, usersController.adminConsole);
