export const handleErrors = (err) => {
  
  let errors = { email: '', password: '', message: '', error: '' }

  if(err.message === 'incorrect email') {
    errors.email = 'Email is not registered!';
  }

  if(err.message === 'incorrect password') {
    errors.password = 'Password is not incorrect!';
  }
  
  //duplicate error code
  if(err.code === 11000) {
    if(errors?.email) errors.email = 'Email was already registerd!';
    if(err?.keyValue.question) errors.message = 'This question already existis';
    errors.error = 'Email was already registerd!'
    return errors
  }

  if(err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({properties}) => {
      errors[properties.path] = properties.message
    })
  }

  errors.error = 'something wrong!'

  return errors;
}