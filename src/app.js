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
import { cartsApiRouter } from './routes/carts-api.router.js';
import { cartsRouter } from './routes/carts.router.js';
import { errorRouter } from './routes/error.router.js';
import { home } from './routes/home.router.js';
import { loggers } from './routes/loggers.router.js';
import { login } from './routes/login.router.js';
import { mockingProductsRouter } from './routes/mocking-products.router.js';
import { productsAdminRouter } from './routes/products-admin-router.js';
import { productsApiRouter } from './routes/products-api.router.js';
import { productsRouter } from './routes/products.router.js';
import { purchasesRouter } from './routes/purchases.router.js';
import { sessionsRouter } from './routes/sessions.router.js';
import { testChatRouter } from './routes/test-chat.router.js';
import { apiTickets } from './routes/tickets.router.js';
import { usersApiRouter } from './routes/users-api.router.js';
import { usersRouter } from './routes/users.router.js';
import CustomError from './services/errors/custom-error.js';
import Errors from './services/errors/enums.js';
import { connectMongo, connectSocketServer, createHash, logger, transport } from './utils/main.js';

// CONFIG BASICAS Y CONEXION A DB
const app = express();
app.use(compression({ brotli: { enabled: true, zlib: {} } }));
const PORT = env.port;
const fileStore = FileStore(session);

connectMongo();

// HTTP SERVER
const httpServer = app.listen(PORT, () => {
  logger.info(`Levantando en puerto http://localhost:${PORT}`);
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

// DIRNAME CONFIG
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { RecoverTokensMongoose } from './DAO/mongo/models/recover-codes.js';
import { UsersMongoose } from './DAO/mongo/models/users.mongoose.js';
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// MIDDLEWARES BASICOS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// CONFIG DEL MOTOR DE PLANTILLAS
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// CONFIG DE PASSPORT
iniPassport();
app.use(passport.initialize());
app.use(passport.session());

// ENDPOINTS
app.use('/api/products', productsApiRouter);
app.use('/api/carts', cartsApiRouter);
app.use('/api/users', usersApiRouter);
app.use('/api/mockingproducts', mockingProductsRouter);
app.use('/loggerTest', loggers);
app.use('/api/tickets', apiTickets);
app.use('/api/sessions', sessionsRouter);
app.get('/api/sessions/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/api/sessions/githubcallback', passport.authenticate('github', { failureRedirect: '/error' }), (req, res) => {
  req.session.user = {
    firstName: req.user.firstName,
    role: req.user.role,
  };
  res.redirect('/home');
});
// PLANTILLAS
app.use('/', login);
app.use('/home', home);
app.use('/products', productsRouter);
app.use('/products-admin', productsAdminRouter);
app.use('/users', usersRouter);
app.use('/cart', cartsRouter);
app.use('/purchases', purchasesRouter);
app.use('/test-chat', testChatRouter);
app.use('/error', errorRouter);

//TODO DEJAR PROLIJO CON TODO EN CAPAS
app.get('/recover-mail', (_, res) => {
  res.render('recover-mail');
});

//TODO DEJAR PROLIJO CON TODO EN CAPAS
app.post('/recover-pass', async (req, res) => {
  let { token, email, password } = req.body;
  console.log(token, email, password);
  const foundToken = await RecoverTokensMongoose.findOne({ token, email });
  if (foundToken && foundToken.expire > Date.now() && password) {
    password = createHash(password);
    const updatedUser = await UsersMongoose.updateOne({ email }, { password });
    res.redirect('/api/sessions/login');
  } else {
    res.render('error', { errorMsg: 'token expiro o token invalido' });
  }
});

//TODO DEJAR PROLIJO CON TODO EN CAPAS
app.get('/recover-pass', async (req, res) => {
  const { token, email } = req.query;
  const foundToken = await RecoverTokensMongoose.findOne({ token, email });
  if (foundToken && foundToken.expire > Date.now()) {
    res.render('recover-pass', { token, email });
  } else {
    res.render('error', { errorMsg: 'token expiro o token invalido' });
  }
});

//TODO DEJAR PROLIJO CON TODO EN CAPAS
app.post('/recover-mail', async (req, res) => {
  //TODO CHEQUEAR QUE SEA UN EMAIL VALIDO (buscar la funcion regex en stackverflow)
  const { email } = req.body;
  //TODO CHEQUEAR SI EXISTE ESTE EMAIL EN LA BASE DE DATOS

  const token = randomBytes(20).toString('hex');
  const expire = Date.now() + 3600000;
  const tokenSaved = await RecoverTokensMongoose.create({
    email,
    token,
    expire,
  });

  const result = await transport.sendMail({
    from: env.googleEmail,
    to: email,
    subject: 'recuperarrrrr cheee!!!',
    html: `
		<div>
			<p>Tu codigo para cambiar pass es ${token}</p>
			<a href="${env.apiUrl}/recover-pass?token=${token}&email=${email}">cambiar?</a>				
		</div>
		`,
  });

  console.log(result);
  res.render('error', { checkEmail: 'Check your email' });
});

app.get('*', (req, res, next) => {
  console.log('que onda?');
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
