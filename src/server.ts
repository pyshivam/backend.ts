/* eslint-disable no-process-exit */

import { Server } from 'http';
import app from '@app';
import logger from '@core/utils/logger';
import errorHandler from 'core/utils/errorHandler';
import config from '@config/config';

const { port, ptojectName } = config;

const server: Server = app.listen(port, (): void => {
  logger.info(`Aapplication '${ptojectName}' listens on PORT: ${port}`);
});

const exitHandler = (): void => {
  if (app) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error): void => {
  errorHandler.handleError(error);
  if (!errorHandler.isTrustedError(error)) {
    exitHandler();
  }
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', (reason: Error) => {
  throw reason;
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
