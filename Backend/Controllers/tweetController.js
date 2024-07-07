import { Tweet } from "../Models/tweetSchema.js";
import { User } from "../Models/userSchema.js";


export const createTweet = async(req,res)=>{
    try{
        const{description, id}= req.body;
        if(!description || !id){
            return res.status(401).json({
                message:"Fields are Required",
                success:false
            });
        }
        const user = await User.findById(id).select("-password");
        await Tweet.create({
            description,
            userId:id,
            userDetails:user
        });

        // await user.updateOne({$push:{followers:loggedInUserId}});
        
        return res.status(201).json({
            message:"Tweet Created Successfully",
            success:true
        });

    } catch(e){
        console.log(e);
        return res.status(500).json({
            message:e,
            success:false
        });
    }
}

export const deleteTweet= async (req,res)=>{
    try {
        const {id}= req.params;
        await Tweet.findByIdAndDelete(id);
        return res.status(200).json({
            message:"Tweet Deleted Successfully",
            success:true
        });
        
    } catch (error) {
        console.log(error);
        return res.json({
            message:error,
            success:false
        });
    }
}

export const likeOrDislike = async (req,res)=>{
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findById(tweetId);
        if(tweet.like.includes(loggedInUserId)){
            // dislike
            await Tweet.findByIdAndUpdate(tweetId,{$pull:{like:loggedInUserId}});
            return res.status(200).json({
                message:"You Disliked the Tweet."
            })
        }else{
            // like
            await Tweet.findByIdAndUpdate(tweetId, {$push:{like:loggedInUserId}});
            return res.status(200).json({
                message:"You Liked the Tweet."
            })
        }
        
    } catch (error) {
        console.log(error);
        return res.json({
            message:error,
            success:false
        });
    }
};

export const getAllTweets = async (req,res) => {
    // loggedInUser ka tweet + following user tweet
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        const loggedInUserTweets = await Tweet.find({userId:id});
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUsersId)=>{
            return Tweet.find({userId:otherUsersId});
        }));
        return res.status(200).json({
            tweets:loggedInUserTweets.concat(...followingUserTweet),
        })
    } catch (error) {
        console.log(error);
        return res.json({
            message:error,
            success:false
        });
    }
};

export const getFollowingTweets = async (req,res) =>{
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id); 
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUsersId)=>{
            return Tweet.find({userId:otherUsersId});
        }));
        return res.status(200).json({
            tweets:[].concat(...followingUserTweet)
        });
    } catch (error) {
        console.log(error);
    }
};