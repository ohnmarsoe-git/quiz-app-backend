import 'dotenv/config'
import { User } from '../models/User.js';
import { handleErrors } from '../utils/handleErrors.js';

const handleRegister = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  console.log(req.body);

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
    res.status(500).json(errors);
  }
}

export {
  handleRegister
}