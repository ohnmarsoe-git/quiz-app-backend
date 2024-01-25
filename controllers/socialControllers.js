import 'dotenv/config'
import fetch from 'node-fetch'
import { User } from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js'
import { handleErrors } from '../utils/handleErrors.js';
import { verfiyGoogleToken } from '../middleware/verifyGoogleToken.js';

const googleLogin = async(req, res) => {

  let user = '';

  const cookies = req.cookies;

  const { credential } = req.body;

  try {

    if(credential) {
        
      const verficationResponse = await verfiyGoogleToken(credential);
        
        if(verficationResponse.error) {
          return res.status(400).json({message: verficationResponse.error})
        }

        const profile = verficationResponse?.payload;

        const email = profile?.email; let newRefreshTokenArray = [];
        
        const existsInDB = await User.findOne({email}).exec();

        const accessToken = generateAccessToken( email );
        const newRefreshToken = generateRefreshToken( email );

        if (!existsInDB) {
          const userInfo =  { 
            firstName : profile?.given_name, 
            lastName: profile?.family_name, 
            email: profile?.email,
            password: '', 
            role: 'user',
            loginType : "social",
            refreshToken: [newRefreshToken]
          }
          user = await User.create(userInfo);
        } else {

          user = {
            id: existsInDB._id,
            email: profile?.email,
            firstName : profile?.given_name, 
            lastName: profile?.family_name,
          }

          newRefreshTokenArray = !cookies.token ? existsInDB?.refreshToken : existsInDB.refreshToken.filter(rt => rt !== cookies.token)
          
          if(cookies?.token) {
            const refreshToken = cookies.token;
            const foundToken = await User.findOne({refreshToken}).exec();

            if(!foundToken) {
              newRefreshTokenArray = []
            }

            res.clearCookie('token' , { httpOnly: true, sameSite: 'None', secure: true })
          }
        
          existsInDB.refreshToken = [...newRefreshTokenArray, newRefreshToken]
          const result = existsInDB.save();

        }
        
        res.cookie('token', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 2592000 });
        
        const responseUser = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: "user", 
        }

        res.status(200).json({ 
          user: responseUser,
          accessToken: accessToken
        });

    }
  } catch (err) {
    const errors = handleErrors(err)
    res.status(500).json({ errors: errors });
  }
}

const gitLogin = async (req,res) => {
  let user = '';
  const cookies = req.cookies;
  const { code } = req.body
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_SECRECT;
  let newRefreshTokenArray = [];

  const params = `?client_id=${client_id}&client_secret=${client_secret}&code=${code}`;

  await fetch(`https://github.com/login/oauth/access_token${params}`, {
    method: "POST",
    headers: {
      "Accept": "application/json"
    }
  }).then((response) => {
    return response.json()
  }).then( (data) => {
      return fetch(`https://api.github.com/user`, {
        method: "GET",
        headers: {
          "Authorization":`Bearer ` + data.access_token  
        }
      }).then((response) => response.json())
      .then( async (response) => {

        const existsInDB = await User.findUser( response?.email );

        const accessToken = generateAccessToken( response?.email );
        const newRefreshToken = generateRefreshToken( response?.email );
        
        // check existing user or not
        if (!existsInDB) {

          const userInfo =  {
            firstName : response?.name,
            email: response?.email,
            role: 'user',
            loginType: 'social',
            refreshToken: [newRefreshToken]
          }

          user = await User.create(userInfo);

        } else {
          
          user = {
            id: existsInDB?._id,
            email: existsInDB?.email,
            firstName : existsInDB?.firstName,
            role: 'user',
            loginType : "social",
          }

          newRefreshTokenArray = !cookies.token ? existsInDB?.refreshToken : existsInDB.refreshToken.filter(rt => rt !== cookies.token)
          
          if(cookies?.token) {
            const refreshToken = cookies.token;
            const foundToken = await User.findOne({refreshToken}).exec();

            if(!foundToken) {
              newRefreshTokenArray = []
            }

            res.clearCookie('token' , { httpOnly: true, sameSite: 'None', secure: true })
          }
        
          existsInDB.refreshToken = [...newRefreshTokenArray, newRefreshToken]
          const result = existsInDB.save();
        }

        res.cookie('token', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 2592000 });

        const responseUser = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: "user", 
        }

        res.status(200).json({ 
          user: responseUser,
          accessToken: accessToken
        });

      }).catch((err) => {
          return res.status(500).json(err);
      })
  })
}

export {
  googleLogin,
  gitLogin,
}