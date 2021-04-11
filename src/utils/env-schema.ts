import * as Joi from 'joi';

export const envSchema = Joi.object({
  REACT_APP_API_KEY: Joi.string().required(),
  REACT_APP_AUH_DOMAIN: Joi.string().required(),
  REACT_APP_PROJECT_ID: Joi.string().required(),
  REACT_APP_STORAGE_BUCKET: Joi.string().required(),
  REACT_APP_MSG_SENDER_ID: Joi.string().required(),
  REACT_APP_APPID: Joi.string().required(),
  REACT_APP_MEASUREMEN_ID: Joi.string().required(),
}).options({ allowUnknown: true });
