import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config({
    path:'../Config/.env'
})

const isAuthenticated = async(req,res,next)=>{
    try{
        //2nd time using cookies and jwt
        const token = req.cookies.token;
        // console.log(token);
        if(!token){
            return res.status(401).json({
                message:"User not Authenticated",
                success:false
            });
        }
        const decode = await jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decode.userId;
        next();

    } catch(e){
        console.log(e);
        return res.json({
            message:e,
            success:false
        });

    }
}

export default isAuthenticated;