import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import app from '../../firebase';
import { Usercontext } from '../contextapi/contextlogin';
import apiClient from '../../apiclient'
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import './profile.css';
import CircularProgressBar from '../feed/post/progress'
const Profile = () => {
  const location = useLocation();
  const { user } = useContext(Usercontext);
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get('username');
  const id = queryParams.get('id');
  const [updatedUser, setUpdatedUser] = useState({});
  const [reload, setReload] = useState(false);
  const [myprogress,setmyprogress]=useState(0)
  const formatName=(fullName)=>{
const nameParts = fullName.trim().split(" "); // Split by spaces
    if (nameParts.length < 2) return fullName; // Return as is if only one name

    return `${nameParts[0]} ${nameParts[1][0]}.`; // First name + Initial of second name
}

  // Fetch the updated user data when user._id doesn't match
  useEffect(() => {
    if (user._id !== id) {
      const fetchUser = async () => {
        try {
          const res = await  apiClient.get(`users/${id}`);
          setUpdatedUser(res.data);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
      fetchUser();
    }
  }, [id, user._id]);

  // Handle file upload (profile and cover picture)
  const uploadFile = async (file, type) => {
    try {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setmyprogress(progress)
                },
                (error) => {
                    console.error(error);
                },
      
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Update the appropriate field based on the type
          if (type === 'profile') {
        
            await  apiClient.put(`post/profilepicture/${user._id}`, { postpic: downloadURL });
          } else if (type === 'cover') {
           
            await  apiClient.put(`post/coverpicture/${user._id}`, { postpic: downloadURL });
          }

          // Fetch the updated user data after the picture is uploaded
          const res = await  apiClient.get(`users/${user._id}`);
          if (res.data.profilepicture || res.data.coverpicture) {
            localStorage.setItem('user', JSON.stringify(res.data));
            setReload(true);
          }
        }
      );
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Refresh page if reload state changes
  useEffect(() => {
    if (reload) {
      window.location.reload();
    }
  }, [reload]);

  return (
    <div className="wrapperally">
         {myprogress!==0 && <div style={{ position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark background with transparency
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,  }}>
      <CircularProgressBar progress={myprogress} />
    </div>}
      {/* Cover picture section */}
      {user._id === id ? (
        <span>
          <label htmlFor="file-cover">
            <div
              style={{
                marginTop: '10px',
                marginLeft: '10px',
                position: 'absolute',
                cursor: 'pointer',
              }}
            >
              <input
                type="file"
                id="file-cover"
                accept=".png,.jpeg,.jpg,.WEBP"
                style={{ display: 'none' }}
                onChange={(e) => uploadFile(e.target.files[0], 'cover')} // Directly call uploadFile on input change
              />
              <CameraAltRoundedIcon
                alt="change cover picture"
                style={{
                  fontSize: '24px',
                  zIndex: '-99',
                  padding: '5px',
                  borderRadius: '50%',
                  backgroundColor: JSON.parse(localStorage.getItem('color')) === 'black' ? 'black' : '#e4e6eb',
                }}

              />

              
            </div>
          </label>
          <img
            style={{ width: user.coverpicture ? '' : '100%' }}
            src={user.coverpicture ? user.coverpicture : '/assets/1713064255659Dubai_Marina_Skyline.jpg'}
            className="back"
            alt="Cover Picture"
          />
        </span>
      ) : (
        <span>
          <img
            style={{
              width: updatedUser.coverpicture ? '' : '100%',
              maxWidth: updatedUser.coverpicture && '100%',
            }}
            src={updatedUser.coverpicture ? updatedUser.coverpicture : '/assets/1713064255659Dubai_Marina_Skyline.jpg'}
            className="back"
            alt="Cover Picture"
          />
        </span>
      )}
      <br />

      {/* Profile picture section */}
      {user._id === id ? (
        <label htmlFor="file-profile">
          <img
            style={{
              borderRadius: '50%',
              width: '150px',
              height: '150px',
            }}
            src={user.profilepicture ? user.profilepicture : '/assets/user.png'}
            className="front"
            alt="Click to change profile picture"
          />
          <div
            style={{
              marginTop: '-32px',
              marginLeft: '84px',
              cursor: 'pointer',
            }}
          >
            <CameraAltRoundedIcon
              style={{
                fontSize: '24px',
                zIndex: '-99',
                padding: '5px',
                borderRadius: '50%',
                backgroundColor: JSON.parse(localStorage.getItem('color')) === 'black' ? 'black' : '#e4e6eb',
              }}
            />
          </div>
          <input
            type="file"
            id="file-profile"
            accept=".png,.jpeg,.jpg,.WEBP"
            style={{ display: 'none' }}
            onChange={(e) => uploadFile(e.target.files[0], 'profile')} // Directly call uploadFile on input change
          />
        </label>
      ) : (
        <img
          style={{
            borderRadius: '50%',
            width: '150px',
            height: '150px',
          }}
          src={updatedUser.profilepicture ?updatedUser.profilepicture: '/assets/user.png'}
          className="front"
          alt="Profile Picture"
        />
      )}

      <h1>{formatName(username)}</h1>
    </div>
  );
};

export default Profile;
