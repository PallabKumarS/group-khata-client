"use server";

export const config = async () => ({
  port: process.env.PORT,
  database_url_local: process.env.DATABASE_URL_LOCAL,
  database_url_dev: process.env.DATABASE_URL_DEV,
  database_url_prod: process.env.DATABASE_URL_PROD,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  node_env: process.env.NODE_ENV,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  local_client: process.env.LOCAL_CLIENT,
  client: process.env.CLIENT,
  sender_email: process.env.SENDER_EMAIL,
  sender_app_pass: process.env.SENDER_APP_PASS,
});
