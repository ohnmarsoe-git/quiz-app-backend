import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import connection from '../db/conn.js';
import { corsOptions } from '../config/corsOptions.js'
import { credentials } from '../middleware/credentials.js'
import  verifyToken   from '../middleware/verifyToken.js';
import registerRouter from '../routes/register.js'
import logoutRouter from '../routes/logout.js'
import authRouter from '../routes/auth.js';
import v1Router  from '../routes/v1/index.js'

const PORT = 5050;

//connect with db
connection();

const app = express();

app.use(express.json());

app.use(cookieParser());

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement

app.use(credentials);
// cross origin
app.use(cors(corsOptions));

// bodyPaser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Auth Routes
app.use('/', authRouter);

// Routes
app.use('/', registerRouter);
app.use('/', logoutRouter);

app.use(verifyToken);
// Router v1
app.use('/api/v1/', v1Router)

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
})