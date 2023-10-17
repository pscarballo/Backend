import UsersDTO from './DTO/users.dto.js';
import { userService } from '../services/users.service.js';
import { logger } from '../utils/main.js';

class UserController {
  async readById(req, res) {
    try {
      const { _id } = req.params;
      const userById = await userService.readById(_id);
      return res.status(201).json({
        status: 'success',
        msg: `Mostrando el producto con id ${_id}`,
        payload: { userById },
      });
    } catch (e) {
      logger.error(e);
    }
  }

  async delUser(req, res) {
    try {
      // const { _id } = req.params;
      const userId = req.params.uid;
      // console.log('userId en controller', userId);
      const delUser = await userService.delUser(userId);
      const dataParseConsole = delUser.map((user) => {
        return {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age,
          role: user.role,
        };
      });
      const firstName = req.session.user.firstName;
      const role = req.session.user.role;
      const title = 'JORDAN® - Console';
      return res.status(200).render('users', { dataParseConsole, title, firstName, role });

      // // // return res.status(201).json({
      // // //   status: 'success',
      // // //   msg: `Mostrando el producto con id ${_id}`,
      // // //   payload: { delUser },
      // // // });
    } catch (e) {
      logger.error(e);
    }
  }
  async adminConsole(req, res) {
    try {
      const data = await userService.read();
      const dataParseConsole = data.map((user) => {
        return {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age,
          // email: user.email,
          // password: user.password,
          role: user.role,
        };
      });
      const firstName = req.session.user.firstName;
      const role = req.session.user.role;
      const title = 'JORDAN® - Console';
      return res.status(200).render('users', { dataParseConsole, title, firstName, role });
    } catch (err) {
      logger.error(err);
      res.status(501).send({ status: 'error', msg: 'Error en el servidor', error: err });
    }
  }

  async premiumSwitch(req, res) {
    try {
      const userId = req.params.uid;
      const user = await userService.premiumSwitch(userId);
      req.session.user.premium = user.premium;
      res.status(200).json(user);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  }

  async read(req, res) {
    try {
      const data = await userService.read();
      const dataParse = data.map((user) => {
        return {
          // id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          // age: user.age,
          email: user.email,
          // password: user.password,
          role: user.role,
        };
      });
      const firstName = req.session.user.firstName;
      const role = req.session.user.role;
      const title = 'JORDAN® - Users';
      return res.status(200).render('users', { dataParse, title, firstName, role });
    } catch (err) {
      logger.error(err);
      res.status(501).send({ status: 'error', msg: 'Error en el servidor', error: err });
    }
  }

  //----------------------------------------------------------------------------------------------------------------
  async deleteInactive(req, res) {
    try {
      const deleteinactiveUsers = await userService.deleteInactiveUser();
    } catch (err) {
      logger.error(e.message);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        payload: {},
      });
    }
  }
  //-------------------------------------------------------------------------------------------------------------------------------------

  async update(req, res) {
    try {
      const { _id } = req.params;
      const { firstName, lastName, age, email, password } = req.body;
      let user = new UsersDTO({ firstName, lastName, age, email, password });
      try {
        const userUpdated = await userService.update(_id, user);
        if (userUpdated) {
          return res.status(201).json({
            status: 'success',
            msg: 'user uptaded',
            payload: {},
          });
        } else {
          return res.status(404).json({
            status: 'error',
            msg: 'user not found',
            payload: {},
          });
        }
      } catch (e) {
        return res.status(500).json({
          status: 'error',
          msg: 'db server error while updating user',
          payload: {},
        });
      }
    } catch (e) {
      logger.error(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        payload: {},
      });
    }
  }

  async loginUser(email, password) {
    try {
      const user = await userService.authenticateUser(email, password);
      return user;
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  async registerUser(req) {
    try {
      const { firstName, lastName, age, email, password } = req.body;
      const role = 'user';
      const userCreated = await userService.registerUser(firstName, lastName, age, email, password, role);
      return userCreated;
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  async postDocuments(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ status: 'error', msg: 'No se ha proporcionado un archivo.' });
      }

      const { uid } = req.params;
      const file = req.file;
      const userUpdated = await userService.postDocuments(uid, file);

      return res.status(200).render('login');
    } catch (e) {
      console.error(e.message);
      return res.status(500).json({
        status: 'error',
        msg: 'Error al subir la imagen de perfil.',
        error: e.message,
      });
    }
  }
}

export const usersController = new UserController();
