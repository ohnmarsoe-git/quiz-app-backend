import { User } from '../models/User.js';

const handleLogout = async (req, res) => {
  const cookies = req.cookies
  if(!cookies?.token) return res.sendStatus(204)

  const refreshToken = cookies.token;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if(!foundUser) {
    res.clearCookie('token', { httpOnly: true, sameSite: 'None', secure: true })
    return res.sendStatus(204)
  }

  // Delete refreshToken in db
  foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);;
  const result = await foundUser.save();

  res.clearCookie('token', { httpOnly: true, sameSite: 'None', secure: true })
  res.status(204).json("Logout successfully");
}

export {
  handleLogout
}