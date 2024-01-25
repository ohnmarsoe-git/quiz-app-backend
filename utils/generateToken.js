import 'dotenv/config'
import jwt from 'jsonwebtoken'

const generateAccessToken = ( user ) => {
  return jwt.sign( { "email": user }, process.env.ACCESSS_TOKEN_SECRET, { expiresIn: "30s" });
}

const generateRefreshToken = (user) => {
  return jwt.sign( { "email": user }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "10m" });
}

export {
  generateAccessToken,
  generateRefreshToken
}