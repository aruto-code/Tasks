const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid(
        "development",
        "staging-sandbox",
        "sandbox",
        "staging-production",
        "production",
        "test"
      )
      .required(),
    PORT: Joi.number().default(3000),
    SERVICE_IDENTIFIER: Joi.string()
      .default("avigate_user_1")
      .description("Identifier to use in other services for identification"),
    LOKI_URL: Joi.string().description("Loki URL for logging"),
    DATABASE_URL: Joi.string().description("DB url"),
    // PG_HOST: Joi.string().required().description("db host"),
    // PG_PORT: Joi.number().required().default(5432),
    // PG_USER: Joi.string().required().description("db username"),
    // PG_PASSWORD: Joi.string().required().description("db password"),
    // PG_DATABASE: Joi.string().required().description("db name"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  serviceId: envVars.SERVICE_IDENTIFIER,
  loki_url: envVars.LOKI_URL,
  dbUrl: envVars.DATABASE_URL,
//   pgHost: envVars.PG_HOST,
//   pgDatabase: envVars.PG_DATABASE,
//   pgPort: envVars.PG_PORT,
//   pgUser: envVars.PG_USER,
//   pgPassword: envVars.PG_PASSWORD,
};