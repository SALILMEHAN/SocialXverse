import React, { useEffect } from 'react'
import { Outlet, useNavigate } from "react-router-dom";
import useOtherUsers from '../hooks/useOtherUsers';
import { useDispatch, useSelector } from "react-redux";
import useGetMyTweets from '../hooks/useGetMyTweets';
import LeftSideBar from './LeftSideBar';
import RightSideBar from './RightSideBar';
import { getRefresh } from '../redux/tweetSlice';


const Home = () => {
    const { user, otherUsers } = useSelector(store => store.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, []);
    // custom Hook
    useOtherUsers(user?._id);
    useGetMyTweets(user?._id);
    // useDispatch(getRefresh());


    return (
        <div className='flex justify-between w-[80%] mx-auto'>
            <LeftSideBar />
            <Outlet />
            <RightSideBar otherUsers={otherUsers} />
        </div>
    )
}

export default Home