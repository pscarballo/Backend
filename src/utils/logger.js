import winston from "winston";

//if (process.env.MODE === "DEVELOPMENT") {
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.colorize({ all: true }),
    }),

    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});
//}

// if (process.env.NODE_ENV === "production") {
//   const logger = winston.createLogger({
//     transports: [
//       new winston.transports.Console({
//         level: "info",
//         format: winston.format.colorize({ all: true }),
//       }),

//       new winston.transports.File({
//         filename: "./errors.log",
//         level: "error",
//         format: winston.format.simple(),
//       }),
//     ],
//   });
// }

export const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.info(
    `${req.method} on ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};
