import axios from 'axios';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { USER_API_END_POINT } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getUser } from '../redux/userSlice';

function EditProfile() {

    const { user } = useSelector(store => store.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, []);

    const [name, setname] = useState(user?.name);
    const [profile_pic, setprofile_pic] = useState("");


    const handleImage = async () => {
        const data = new FormData();
        data.append('file', profile_pic);
        data.append('upload_preset', 'twitter_clone_project');
        // data.append('cloud_name', 'duwxtwter');

        // console.log(data);


        try {
            const cloudinary_name = 'duwxtwter';
            const cloudinary_url = `https://api.cloudinary.com/v1_1/${cloudinary_name}/image/upload`;
            const res_cloudinary = await fetch(cloudinary_url, {
                method: 'POST',
                body: data
            });
            const d = await res_cloudinary.json();
            const imageUrl = d.secure_url;
            // console.log(imageUrl);
            return imageUrl;

        } catch (error) {
            console.log(error);
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        const img_url = await handleImage();

        try {
            const res = await axios.patch(`${USER_API_END_POINT}/edit`, { id: user?._id, name: name, avatar: img_url }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            // console.log(res);
            if (res.data.success) {


                ///////////////////
                const newuser = await axios.get(`${USER_API_END_POINT}/logedinprofile/${user?._id}`, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                });
                // console.log(newuser.data.user);
                dispatch(getUser(newuser?.data?.user));
                // dispatch(getMyProfile(newuser?.user));



                toast.success(res.data.message);
                navigate(`/profile/${user?._id}`);
            }
        } catch (error) {
            // toast.error(error.response.data.message);
            console.log(error);
        }
    }


    return (
        <div className='mt-10 font-bold w-full flex flex-col items-center p-4'>
            <h1 className='text-3xl mb-14'>EDIT PROFILE</h1>
            <form className='font-bold flex flex-col items-center w-full'>
                <div className='flex flex-col items-center'>
                    <div className='flex'>
                        <p className='m-4'>Enter New Name :</p>
                        <input type='text' className='border-4 m-4' value={name} onChange={(e) => setname(e.target.value)}></input>
                    </div>
                    <div className='flex'>
                        <p className='m-4'>Edit Avatar :</p>
                        <input type='file' accept="image/*" className='m-4' onChange={(e) => setprofile_pic((prev) => e.target.files[0])} />
                    </div>
                    {profile_pic != "" ? <img src={URL.createObjectURL(profile_pic)} alt='avatar' className='w-6/12 border-2' /> : <></>}
                </div>
                <button className='p-3 rounded-xl text-white font-bold m-8' style={{ background: "blue" }} onClick={submitHandler}>Submit</button>
            </form>
            {/* <img src={profile_pic} /> */}
        </div >
    )
}

export default EditProfile