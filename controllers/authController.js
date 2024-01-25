import { User } from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import { handleErrors } from '../utils/handleErrors.js';

const maxAge =  24 * 60 * 60 * 1000; // 1 day


const handleLogin = async(req, res) => {

  const cookies = req.cookies;

  const userData = {
    email: req.body?.user || req.body?.email,
    password: req.body.password
  }

  if (!userData.email || !userData.password) return res.status(400).json({ 'message': 'Username and password are required.' });

  try {

    const login = await User.login( userData.email, userData.password );

    if (!login) return res.status(401).json({ errors: error }); //Unauthorized

    if(login) {
      const email = userData.email;
      const foundUser = await User.findOne({email}).exec()

      const accessToken = generateAccessToken( foundUser.email );
      const newRefreshToken = generateRefreshToken(foundUser.email);


      let newRefreshTokenArray = [];
      newRefreshTokenArray = !cookies.token ? foundUser.refreshToken : foundUser.refreshToken.filter(rt => rt !== cookies.token)
      
      if(cookies?.token) {
        const refreshToken = cookies.token;
        const foundToken = await User.findOne({refreshToken}).exec();

        if(!foundToken) {
          newRefreshTokenArray = []
        }

        res.clearCookie('token' , { httpOnly: true, sameSite: 'None', secure: true })
      }


      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]
      const result = foundUser.save();
      
      // const result = await User.updateOne({_id: foundUser._id}, {$set: {refreshToken: newRefreshToken}});

      res.cookie('token', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 2592000 });
      
      const responseUser = {
        id: foundUser?._id,
        email: foundUser?.email,
        firstName: foundUser?.firstName,
        lastName: foundUser?.lastName,
        role: foundUser?.role
      }

      res.status(200).json({
        user: responseUser,
        accessToken: accessToken
      });

  } else {
    const error = handleErrors(errors);
    res.status(500).send({ errors: error })
  } 

  } catch(error) {
    const errors = handleErrors(error);
    res.status(500).send({ errors})
  }
}

export {
  handleLogin
}