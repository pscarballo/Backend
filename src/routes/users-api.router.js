import express from 'express';
export const usersApiRouter = express.Router();
import { usersController } from '../controllers/users.controller.js';
import { profileUploader } from '../utils/main.js';

// usersApiRouter.post("/", usersController.create);
usersApiRouter.get('/', usersController.read);
usersApiRouter.put('/:_id', usersController.update);
usersApiRouter.delete('/:_id', usersController.delete);
usersApiRouter.get('/premium/:uid', usersController.premiumSwitch);
usersApiRouter.post('/:uid/profile', profileUploader.single('profileImage'), usersController.postDocuments);
