import express from 'express';
export const usersApiRouter = express.Router();
import { usersController } from '../controllers/users.controller.js';
import { profileUploader } from '../utils/main.js';
import { checkAdmin } from '../middlewares/main.js';

usersApiRouter.get('/', checkAdmin, usersController.read);
usersApiRouter.delete('/delete', usersController.deleteInactive);
usersApiRouter.get('/premium/:uid', usersController.premiumSwitch);
usersApiRouter.post('/:uid/profile', profileUploader.single('profileImage'), usersController.postDocuments);

// usersApiRouter.post("/", usersController.create);
// usersApiRouter.get('/', usersController.read);
// usersApiRouter.put('/:_id', usersController.update);
