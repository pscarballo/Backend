import MongoStore from 'connect-mongo';
import { randomBytes } from 'crypto';
import express from 'express';
import compression from 'express-compression';
import handlebars from 'express-handlebars';
import session from 'express-session';
import passport from 'passport';
import FileStore from 'session-file-store';
import env from './config/enviroment.config.js';
import { iniPassport } from './config/passport.config.js';
import { errorHandler } from './middlewares/main.js';
import { cartsApiRouter } from './routes/carts-api.routes.js';
import { cartsRouter } from './routes/carts.routes.js';
import { home } from './routes/home.routes.js';
import { loggers } from './routes/loggers.routes.js';
import { login } from './routes/login.routes.js';
import { passwRecoverRouter } from './routes/passw-recover.routes.js';
import { productsApiRouter } from './routes/products-api.routes.js';
import { purchasesRouter } from './routes/purchases.routes.js';
import { sessionsRouter } from './routes/sessions.routes.js';
import { apiTickets } from './routes/tickets.routes.js';
import { usersApiRouter } from './routes/users-api.routes.js';
import CustomError from './services/errors/custom-error.js';
import Errors from './services/errors/enums.js';
import { connectMongo, connectSocketServer, createHash, logger, transport } from './utils/main.js';

// -------------------------------------------------------CONFIG BASICAS Y CONEXION A DB-------------------------------------------------------------//
const app = express();
app.use(compression({ brotli: { enabled: true, zlib: {} } }));
const PORT = env.port;
const fileStore = FileStore(session);

connectMongo();

//---------------------------------------------------------------- HTTP SERVER-----------------------------------------------------------------------//
const httpServer = app.listen(PORT, () => {
  logger.info(`🚀 App listening on http://localhost:${PORT}`);
});

connectSocketServer(httpServer);
app.use(
  session({
    secret: 'jhasdkjh671246JHDAhjd',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: env.mongoUrl,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 3600,
    }),
  })
);

// ---------------------------------------------------------------DIRNAME CONFIG---------------------------------------------------------------------//
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { RecoverTokensMongoose } from './DAO/mongo/models/recover-codes.js';
import { UsersMongoose } from './DAO/mongo/models/users.mongoose.js';
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

//---------------------------------------------------------------- MIDDLEWARES------------------------------------------------------------------------//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//-------------------------------------------------------- CONFIG DEL MOTOR DE PLANTILLAS-------------------------------------------------------------//
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//-------------------------------------------------------------------PASSPORT-------------------------------------------------------------------------//
iniPassport();
app.use(passport.initialize());
app.use(passport.session());

//--------------------------------------------------------------- Documentacion API------------------------------------------------------------------//

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

//-------------------------------------------------------------------Swagger------------------------------------------------------------------------//
const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentacion Jordans Clothes',
      description: 'Proyecto Coder',
    },
  },
  apis: [`${__dirname.replace(/\/[^/]*$/, '/')}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//------------------------------------------------------------------ ENDPOINTS------------------------------------------------------------------------//
app.use('/api/products', productsApiRouter);
app.use('/api/carts', cartsApiRouter);
app.use('/api/users', usersApiRouter);
app.use('/loggerTest', loggers);
app.use('/api/tickets', apiTickets);
app.use('/api/sessions', sessionsRouter);

// -------------------------------------------------------------------PLANTILLAS----------------------------------------------------------------------//
app.use('/', login);
app.use('/home', home);
app.use('/cart', cartsRouter);
app.use('/purchases', purchasesRouter);
app.use('/passw-recover', passwRecoverRouter);

app.get('*', (req, res, next) => {
  try {
    CustomError.createError({
      name: 'Page Not Found',
      cause: 'Non existent path',
      message: 'The path you are trying to access does not exist',
      code: Errors.ROUTING_ERROR,
    });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);
