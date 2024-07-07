import jwt from "jsonwebtoken";
import { User } from "../Models/userSchema.js";
import bcryptjs from 'bcryptjs';
import uploadOnCloudinary from "../Config/cloudinary.js";
import { Tweet } from "../Models/tweetSchema.js";


export const Register = async(req,res)=>{
    try{
        const {name,username,email,password}=req.body;
        //basic validation
        if(!name || !username || !email || !password){
            return res.status(401).json({
                message:'All Fields Are Required',
                success:false
            });
        }
        const user=await User.findOne({email});
        if(user){
            return res.status(401).json({
                message:'User Already Exist',
                success:false
            });
        }

        //everything ok
        const hashedPassword=await bcryptjs.hash(password,16);


        await User.create({
            name,
            username,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            message:'Account Created Successfully',
            success:true
        });

    } catch(e){
        console.log(e);
        return res.status(500).json({
            message:e,
            success:false
        });
    }
};

export const login= async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(401).json({
                message:'All Fields Are Required',
                success:false
            });
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message:'User Not Exists',
                success:false
            });
        }

        const isMatch= await bcryptjs.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({
                message:"Incorrect Email or Password",
                success: false
            });
        }


        //jwt and cookie concept start from here
        const tokenData={
            userId:user._id
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn:'1d'});
        return res.status(201).cookie("token", token, {expiresIn:'1d', httpOnly:true}).json({
            message:`Welcome Back, ${user.name}`,
            user,
            success:true
        });

    } catch(e){
        console.log(e);
        return res.status(500).json({
            message:e,
            success:false
        })
    }
};

export const logout=(req,res)=>{
    return res.cookie('token', '', {expiresIn:new Date(Date.now())}).json({
        message:"User Logged out Successfully",
        success:true
    })
};

export const logedinprofile= async(req,res)=>{
    try {
        const id= req.params.id;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({
                message:'User Not Exists',
                success:false
            });
        }
        return res.status(200).json({
            user
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:error,
            success:false
        });
    }
}

export const bookmark = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const user = await User.findById(loggedInUserId);
        if (user.bookmarks.includes(tweetId)) {
            // remove
            await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "Removed from bookmarks."
            });
        } else {
            // bookmark
            await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "Saved to bookmarks."
            });
        }
    } catch (error) {
        console.log(error);
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select("-password");
        return res.status(200).json({
            user,
        })
    } catch (error) {
        console.log(error);
    }
};

export const getOtherUsers = async (req,res) =>{ 
    try {
         const {id} = req.params;
         const otherUsers = await User.find({_id:{$ne:id}}).select("-password");
         if(!otherUsers){
            return res.status(401).json({
                message:"Currently do not have any users."
            });
         }
         return res.status(200).json({
            otherUsers
        })
    } catch (error) {
        console.log(error);
    }
};

export const follow = async(req,res)=>{
    try {
        // console.log(req);
        const loggedInUserId = req.body.id; 
        const userId = req.params.id; 
        const loggedInUser = await User.findById(loggedInUserId);//salil
        const user = await User.findById(userId);//abcd
        if(!user.followers.includes(loggedInUserId)){
            await user.updateOne({$push:{followers:loggedInUserId}});
            await loggedInUser.updateOne({$push:{following:userId}});
        }else{
            return res.status(400).json({
                message:`You already followed to ${user.name}`
            })
        };
        return res.status(200).json({
            message:`${loggedInUser.name} just follow to ${user.name}`,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
};

export const unfollow = async (req,res) => {
    try {
        const loggedInUserId = req.body.id; 
        const userId = req.params.id; 
        const loggedInUser = await User.findById(loggedInUserId);//salil
        const user = await User.findById(userId);//abcd
        if(loggedInUser.following.includes(userId)){
            await user.updateOne({$pull:{followers:loggedInUserId}});
            await loggedInUser.updateOne({$pull:{following:userId}});
        }else{
            return res.status(400).json({
                message:`User has not followed yet`
            })
        };
        return res.status(200).json({
            message:`${loggedInUser.name} unfollowed to ${user.name}`,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
};

export const edit= async (req,res)=>{
    try{
        const {id, name, avatar}=req.body;
        // console.log(req.body);
        if(!id){
            return res.status(401).json({
                message:"ID is required!",
                success:false
            });
        }
        if(!name){
            return res.status(401).json({
                message:"Enter Name!",
                success:false
            });
        }
        if(!avatar){
            return res.status(401).json({
                message:"Please upload your Avatar!",
                success:false
            });
        }

        //cloudinary
        // const img_url= await uploadOnCloudinary(avatar).url;
        // console.log(img_url);

        await User.findByIdAndUpdate(id,{
            name,
            avatar
        });

        //avatar urls
        // https://img.freepik.com/premium-photo/memoji-happy-man-white-background-emoji_826801-6836.jpg?w=740
        // https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar-thumbnail.png

        // console.log(user);

        const t=[]
        t.push(await User.findById(id))
        // await Tweet.updateMany({userId:id},{userDetails:t});
        const tweets= await Tweet.find({userId:id});
        // console.log(tweets);
        for (let i = 0; i < tweets.length; i++) {
            await Tweet.findByIdAndUpdate(tweets[i]._id,{userDetails:t});
        }


        return res.json({
            message:'Successfully Updated the Profile',
            success:true
        });

    }catch(error){
        console.log(error);
        return res.json({
            message:error,
            success:false
        })
    }
};