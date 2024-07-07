import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config({
    path:"../Config/.env"
})


const databaseConnection=()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then(console.log("Connected To MongoDB"))
    .catch((error)=>{
        console.log(error);
    })
}

export default databaseConnection;