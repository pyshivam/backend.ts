import Joi from 'joi';
import { ValidationSchema } from '@core/interfaces/validationSchema';

const loginValidation: ValidationSchema = {
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().required(),
  }),
};

export default loginValidation;
