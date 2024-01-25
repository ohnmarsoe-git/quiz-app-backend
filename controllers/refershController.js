import jwt from 'jsonwebtoken';
import 'dotenv/config'
import { User } from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';

const handleRefreshToken = async (req, res) => {

  const cookies = req.cookies;

  if (!cookies?.token) return res.sendStatus(401);
  
  const refreshToken = cookies.token;

  res.clearCookie('token', { httpOnly: true, sameSite: 'None', secure: true });

  const foundUser = await User.findOne({ refreshToken }).exec();
  // const foundUser = await User.find( {"refreshToken": {"$in": refreshToken}} ).exec();


  // // if(!foundUser) return res.status(403).json({message:'Not found user'})

  if(!foundUser) {
    jwt.verify(
      refreshToken, 
      process.env.REFRESH_TOKEN_SECRET, 
      async (err, decoded) => {
        if (err) return res.sendStatus(403); //Forbidden
          console.log('attempted refresh token reuse!')
          const hackedUser = await User.findOne({ email: decoded.email }).exec();
          hackedUser.refreshToken = [];
          const result = await hackedUser.save();
          console.log(result);
    })
    return res.sendStatus(403); //Forbidden
  }

  const newRefreshTokenArray = foundUser?.refreshToken.filter(rt => rt !== refreshToken);
  
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      
      if(err) {
        console.log('expired refresh token')
        // expired refresh token
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = foundUser.save();
        return res.status(401).json('expired');
      }

      if(err || foundUser.email !== decoded.email) return res.sendStatus(403)

      const accessToken = generateAccessToken(foundUser.email);
      const newRefreshToken = generateRefreshToken(foundUser.email)

      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();

      res.cookie('token', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 2592000 })
      
      res.json({ accessToken });
    }
  )
}

export {
  handleRefreshToken
}