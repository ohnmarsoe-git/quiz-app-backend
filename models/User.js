import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchemea = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first Name'],
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail , 'Please enter a valid email']
  },
  password: {
    type: String,
    // required: [true, 'Please enter an password'],
    // minLength: [6, 'Minimum password length is 6 characters']
  },
  role: {
    type: String,
    default: "user"
  },
  loginType: {
    type: String,
    required: false
  },
  refreshToken: [String]
})

// fire a function before doc saved to db
userSchemea.pre('save', async function(next) {

  if(this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    console.log('New user is about to be created and saved', this);
  }

  if (this.socialLogin) {
    this.password = null;
  }

  next();
})

// static method to login user
userSchemea.statics.login = async function(email, password) {
  const user = await this.findOne({ email })
  if (user) {
    const auth = await bcrypt.compare( password, user.password);
    if(auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
}

// find user exist or not
userSchemea.statics.findUser = async function (email) {
  const user = await this.findOne({ email })
  return user;
}

const User = mongoose.model('user', userSchemea);

export {
  User
}