import express, { response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import fetch from 'node-fetch'
import { User } from '../models/User.js';
import { signToken, generateRefreshToken } from '../utils/generateToken.js';
import { handleErrors } from '../utils/handleErrors.js';
import { verfiyGoogleToken } from '../middleware/auth.js';

const maxAge =  24 * 60 * 60;

const refreshToken = (req, res) => {

  const token = req.cookies.token || req.body.token || req.headers['authorization']
  
  //const token = authHeader && authHeader.split(' ')[1]

  // send error if there is no token or invalid
  if(token === null) return res.status(401).json({message:'You are not authenicated!'})

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    
    if(err) return res.status(400).json({data: err.message});
   
    const newAccessToken = signToken( user );
    const newrefreshToken = generateRefreshToken( user );

    res.cookie('token', newrefreshToken, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newrefreshToken
    })
  })
}

const login = async(req, res) => {

  let user = '';

  const { email, password, credential } = req.body;

  try {

    if(credential) {
        
      const verficationResponse = await verfiyGoogleToken(credential);
        
        if(verficationResponse.error) {
          return res.status(400).json({message: verficationResponse.error})
        }

        const profile = verficationResponse?.payload;
        
        const existsInDB = await User.findUser( profile?.email );

        if (!existsInDB) {
          const userInfo =  { 
            firstName : profile?.given_name, 
            lastName: profile?.family_name, 
            email: profile?.email,
            password: '', 
            role: 'user',
            loginType : "social",
          }
          // console.log(userInfo);

          user = await User.create(userInfo);

        } else {
          user = {
            id: existsInDB._id,
            email: profile?.email,
            firstName : profile?.given_name, 
            lastName: profile?.family_name,
          }
        }
        
        const accessToken = signToken( user.email );
        const refreshToken = generateRefreshToken( user.email );

        // refreshTokens.push(accessToken);
        res.cookie('token', refreshToken, { httpOnly: true, maxAge: maxAge * 1000 });
        

        res.status(200).json({ 
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: "user", 
          accessToken: accessToken,
          refreshToken: refreshToken
        });

    } else {
      // normal login

      const user = await User.login( email, password );

      const accessToken = signToken( user.email );
      const refreshToken = generateRefreshToken( user.email );
      
      // refreshTokens.push(accessToken);
      res.cookie('token', refreshToken, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ 
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role, 
        accessToken: accessToken,
        refreshToken: refreshToken
      });
    }

  
  } catch (err) { 
    const errors = handleErrors(err)
    res.status(400).json({ errors: errors });
  }
}

const gitLogin = async (req,res) => {
  let user = '';
  const { code } = req.body
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_SECRECT;

  const params = `?client_id=${client_id}&client_secret=${client_secret}&code=${code}`;

  await fetch(`https://github.com/login/oauth/access_token${params}`, {
    method: "POST",
    headers: {
      "Accept": "application/json"
    }
  }).then((response) => {
    return response.json()
  }).then( (data) => {
    
      //res.json(data);

      return fetch(`https://api.github.com/user`, {
        method: "GET",
        headers: {
          "Authorization":`Bearer ` + data.access_token  
        }
      }).then((response) => response.json())
      .then( async (response) => {

        const existsInDB = await User.findUser( response?.email );
        
        // check existing user or not
        if (!existsInDB) {
          const userInfo =  {
            firstName : response?.name,
            email: response?.email,
            role: 'user',
            loginType: 'social'
          }
          user = await User.create(userInfo);

        } else {
          user = {
            email: response?.email,
            firstName : response?.name,
            role: 'user',
            loginType : "social",
          }
        }

        const accessToken = signToken( response.email );
        const refreshToken = generateRefreshToken( response.email );

        res.cookie('token', refreshToken, { httpOnly: true, maxAge: maxAge * 1000 });

        res.status(200).json({
          id: user._id,
          email: user.email,
          firstName : response?.name,
          role: 'user', 
          accessToken: accessToken,
          refreshToken: refreshToken
        });

        // return res.status(200).json(response)
      }).catch((err) => {
          return res.status(500).json(err);
      })
  })
}

const register = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    const user = await User.create({ 
      firstName, 
      lastName, 
      email,  
      password, 
      role,
      loginType : "email",
    });
    res.status(200).send(user);
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json(errors);
  }
}

const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json("Logout successfully");
}

export {
  login,
  gitLogin,
  register,
  refreshToken,
  logout
}