import express from 'express';
import dotenv from 'dotenv';
import databaseConnection from './Config/database.js';
import cookieParser from 'cookie-parser';
import userRoute from './Routes/userRoute.js';
import tweetRoute from './Routes/tweetRoute.js';
import cors from 'cors';


dotenv.config({
    path:".env"
})
databaseConnection();
const app=express();

//middlewares
app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin:"https://social-xverse-client.vercel.app",
    credentials:true
}
app.use(cors(corsOptions));

//api
app.use('/api/v1/user', userRoute);
app.use('/api/v1/tweet', tweetRoute);



app.listen(process.env.PORT,()=>{
    console.log(`Server Is Listening at Port ${process.env.PORT}`)
})