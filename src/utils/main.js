//---------------------------------------------------------------NODEMAILER-----------------------------------------------------------//
import nodemailer from 'nodemailer';
export const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASS,
  },
});

//---------------------------------------------------------------- BCRYPT------------------------------------------------------------//
import bcrypt from 'bcrypt';
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);

// ---------------------------------------------------------------MONGOOSE-----------------------------------------------------------//
import { connect } from 'mongoose';
import env from '../config/enviroment.config.js';
export async function connectMongo() {
  try {
    await connect(env.mongoUrl);
    logger.info('🖥️  Successful connection to DB.');
  } catch (e) {
    logger.error('DB connection failure.');
    throw 'Connection failure';
  }
}

//------------------------------------------------------------ CONNECT-SOCKET-------------------------------------------------------//
import { Server } from 'socket.io';
import { MsgModel } from '../DAO/mongo/models/msgs.mongoose.js';
import { ProductsMongoose } from '../DAO/mongo/models/products.mongoose.js';

export function connectSocketServer(httpServer) {
  const socketServer = new Server(httpServer);

  socketServer.on('connection', async (socket) => {
    try {
      const allProducts = await ProductsMongoose.find({});
      socket.emit('products', allProducts);
    } catch (e) {
      logger.error(e);
    }

    socket.on('new-product', async (newProd) => {
      try {
        await ProductsMongoose.create(newProd);
        const prods = await ProductsMongoose.find({});
        socketServer.emit('products', prods);
      } catch (e) {
        logger.error(e);
      }
    });

    socket.on('productModified', async (id, newProd) => {
      try {
        await ProductsMongoose.findOneAndUpdate({ _id: id }, newProd);
        const prod = await ProductsMongoose.find({});
        socketServer.emit('products', prod);
      } catch (e) {
        logger.error(e);
      }
    });

    socket.on('delete-product', async (idProd) => {
      try {
        await ProductsMongoose.deleteOne({ _id: idProd });
        const prods = await ProductsMongoose.find({});
        socketServer.emit('products', prods);
      } catch (e) {
        logger.error(e);
      }
    });

    socket.on('msg_front_to_back', async (msg) => {
      try {
        await MsgModel.create(msg);
      } catch (e) {
        logger.error(e);
      }
      try {
        const msgs = await MsgModel.find({});
        socketServer.emit('listado_de_msgs', msgs);
      } catch (e) {
        logger.error(e);
      }
    });
  });
}

//------------------------------------------------------------- NANO ID------------------------------------------------------------//
import { customAlphabet } from 'nanoid';

export function generateCartId() {
  const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 25);
  return nanoid();
}

//----------------------------------------------------------------- FAKER-JS---------------------------------------------------------//

import { faker, fakerFR } from '@faker-js/faker';
export const generateUser = () => {
  const numOfProducts = parseInt(faker.string.numeric(1, { bannedDigits: ['0'] }));
  const products = [];

  for (let i = 0; i < numOfProducts; i++) {
    products.push(generateProduct());
  }

  return {
    name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    birthgDate: faker.date.birthdate(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    sex: faker.name.sex(),
    products,
  };
};

export const generateProduct = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    thumbnail: faker.image.url(),
    code: faker.string.numeric(10),
    stock: faker.string.numeric(1),
  };
};

//--------------------------------------------------------------LOGGER CON WINSTON-----------------------------------------------------//

import winston from 'winston';

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.colorize({ all: true }),
    }),
    new winston.transports.File({
      filename: './errors.log',
      level: 'warn',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        })
      ),
    }),
  ],
});

//------------------------------------------------------------------- MULTER--------------------------------------------------------//
import multer from 'multer';
import { __dirname } from '../app.js';

const profilesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/profiles');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

export const profileUploader = multer({ storage: profilesStorage });
