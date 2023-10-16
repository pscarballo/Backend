import { UsersMongoose } from '../mongo/models/users.mongoose.js';
import { logger } from '../../utils/main.js';
import { subDays } from 'date-fns';
import { transport } from '../../utils/main.js';
// import { checkLogin } from '../../middlewares/main.js';

class UsersModel {
  async readOne(email) {
    try {
      const user = await UsersMongoose.findOne(
        { email: email },
        {
          _id: true,
          firstName: true,
          lastName: true,
          age: true,
          email: true,
          password: true,
          role: true,
          cartID: true,
          purchase_made: true,
        }
      );
      return user;
    } catch (e) {
      logger.error(e);
    }
  }

  async read() {
    try {
      const users = await UsersMongoose.find(
        {},
        {
          _id: true,
          firstName: true,
          lastName: true,
          age: true,
          email: true,
          password: true,
          role: true,
          premium: true,
          cartID: true,
          purchase_made: true,
          last_connection: true,
        }
      );
      return users;
    } catch (e) {
      logger.error(e);
    }
  }

  async readById(_id) {
    try {
      const userById = await UsersMongoose.findOne({ _id });
      return userById;
    } catch (e) {
      logger.error(e);
    }
  }

  async create(firstName, lastName, age, email, password, role, cartID) {
    try {
      const userCreated = await UsersMongoose.create({
        firstName,
        lastName,
        age,
        email,
        password,
        role,
        cartID,
        purchase_made: [],
      });
      return userCreated;
    } catch (e) {
      logger.error(e);
    }
  }

  async update(_id, user) {
    try {
      const userUpdated = await UsersMongoose.findByIdAndUpdate(_id, user, {
        new: true,
      });
      return userUpdated;
    } catch (e) {
      logger.error(e);
      return false;
    }
  }

  //---------------------------------------------------------
  async findInactive(today) {
    try {
      const inactiveUsers = await UsersMongoose.find({
        last_connection: { $lt: subDays(today, 2) },
      });

      return inactiveUsers;
    } catch (e) {
      logger.error(e.message);
      throw e;
    }
  }

  async deleteInactiveUser(findedUser) {
    try {
      const deletedUser = await UsersMongoose.deleteMany({
        _id: { $in: findedUser.map((user) => user._id) },
      });
      const deletedUserMail = findedUser.map((user) => user.email);
      const deletedUserFirstName = findedUser.map((user) => user.firstName);

      const resul = await transport.sendMail({
        from: process.env.GOOGLE_EMAIL,
        to: deletedUserMail,
        subject: 'Deleted Account',
        html: `
            <div>
            <h1>Hi ${deletedUserFirstName || 'User'},</h1>
                 <p>We inform you that your account has been deleted for inactivity.</p>
            </div>
            `,
      });
    } catch (e) {
      logger.error(e.message);
      throw e;
    }
  }
}

export const usersModel = new UsersModel();
