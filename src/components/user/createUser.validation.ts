import Joi from 'joi';
import { ValidationSchema } from '@core/interfaces/validationSchema';

const createUserValidation: ValidationSchema = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    country: Joi.string().required(),
    phone: Joi.string().required(),
    username: Joi.string().alphanum().required(),
  }),
};

export default createUserValidation;
