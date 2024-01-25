import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.set("strictQuery", false);

const connection = () => {
  const connectionParmas = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

  try {
    mongoose.connect(
        `mongodb+srv://zencool21:${process.env.DB_PWD}@cluster0.0dunpkz.mongodb.net/QNA?retryWrites=true&w=majority`,
        connectionParmas
      );
    console.log('DB connected successfully')
  } catch(error) {
    console.log('Database connection failed!')
  }
}

export default connection;