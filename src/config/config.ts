import Joi from 'joi';
import { readPackage } from '@core/utils/package';

require('dotenv').config();

// All env variables used by the app should be defined in this file.

// To define new env:
// 1. Add env variable to .env.local file;
// 2. Provide validation rules for your env in envsSchema;
// 3. Make it visible outside of this module in export section;
// 4. Access your env variable only via config file.
// Do not use process.env object outside of this file.

const envsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'integration', 'development')
      .required(),
    PORT: Joi.number().default(8080),
    HOST_URL: Joi.string().default(`http://localhost:8080`), // TODO: change to your host url
    API_KEY_TOKEN: Joi.string().required(),
    MONGODB_URL: Joi.string().required(),
    MONGODB_DB_NAME: Joi.string().required(),
    JWT_SECRET_KEY: Joi.string().required(),
    REFRESH_TOKEN_SECRET_KEY: Joi.string().required(),
    GMAIL_APP_PASSWORD: Joi.string().required(),
    GMAIL: Joi.string().email().required(),
  })
  .unknown(true);

const { value: envVars, error } = envsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(
    `Config validation error: ${error.message}. \n
     This app requires env variables to work properly. If you run app locally use docker-compose`,
  );
}
const packageData = readPackage(process.cwd(), true);

// map env vars and make it visible outside module
export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  hostUrl: envVars.HOST_URL,
  xApiKey: envVars.API_KEY_TOKEN,
  ptojectName: packageData.name,
  projectVersion: packageData.version,
  mongoUrl: envVars.MONGODB_URL,
  mongoDbName: envVars.MONGODB_DB_NAME,
  jwtSecretKey: envVars.JWT_SECRET_KEY,
  refreshTokenSecretKey: envVars.REFRESH_TOKEN_SECRET_KEY,
  gmailAppPassword: envVars.GMAIL_APP_PASSWORD,
  gmail: envVars.GMAIL,
};
