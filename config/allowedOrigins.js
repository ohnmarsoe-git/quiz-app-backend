import 'dotenv/config';

const allowedOrigins = [
  process.env.SERVER_URL,
  process.env.BASE_URL
];

export { allowedOrigins }