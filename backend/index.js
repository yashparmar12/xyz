import express from 'express';
import db from './db.js';
import cookieParser from 'cookie-parser';

import userRoute from './routes/userRoute.js';
import cors from "cors"
// import adminRoute from './routes/adminRoute.js';

const app = express();
const PORT = 8000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//It only handles key- value pairs
 

// app.use(cors());

const corsOptions = {
    origin: 'http://localhost:3000',  // Allow frontend to access backend
    credentials: true,  // Allow cookies to be sent
  };
  
  app.use(cors(corsOptions));

app.get('/',(req,res)=>{
    res.send("<h1>Hiii Good Morning</h1>");
})

app.use('/api/user', userRoute);
// app.use('/api/admin', adminRoute);

app.listen(PORT, ()=>{
    console.log(`Server running at ${PORT}`);
    db();
})