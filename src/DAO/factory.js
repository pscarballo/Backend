import mongoose from 'mongoose';
import env from '../config/enviroment.config.js';
import { logger } from '../utils/main.js';
import { cartsModel } from './mongo/carts.model.js';
import { productsModel } from './mongo/products.model.js';
import { ticketsModel } from './mongo/tickets.model.js';
import { usersModel } from './mongo/users.model.js';

async function importModels() {
  let models;

  switch (env.persistence) {
    case 'MONGO':
      logger.info('DB: MongoDB');
      mongoose.connect(env.mongoUrl);
      models = {
        products: productsModel,
        users: usersModel,
        carts: cartsModel,
        tickets: ticketsModel,
      };
      break;

    // case 'MEMORY':
    //   logger.info('DB: Memory persistence');
    //   models = {
    //     products: productsMemory,
    //     users: usersMemory,
    //     carts: cartsMemory,
    //     tickets: ticketsMemory,
    //   };
    //   break;

    default:
      throw new Error(`El tipo de persistencia "${env.persistence}" no es válido.`);
  }

  return models;
}

export default importModels;
