import React from 'react'
import apiClient from '../../apiclient'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

const Conversation = ({ myuse, user, socket, currentchat,online }) => {
  const [a, setA] = useState({});
  const [nb, setNb] = useState();
  const [nb2, setNb2] = useState([]);

  const myuser = useMemo(() => myuse.members?.find((s) => s !== user?._id), [myuse, user?._id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get(`users/${myuser}`);
        setA(res.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchMessages = async () => {
      try {
        if(nb!==0){
          const res = await apiClient.get(`tchat/message/${myuse._id}`);
        setNb2(res.data);
        }
        
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchUser();
    fetchMessages();

    const handleNewMessage = ({ senderid, text, maconv }) => {
      const arrivalMessage = {
        messagee: text,
        sender: senderid,
        maconv: maconv,
        createdAt: Date.now(),
        read: ''
      };
      if (maconv._id === myuse._id  ) {
        if(currentchat._id !== myuse._id){
           
setNb2((prev) => [...prev, arrivalMessage]);
        }
        
      }
    };

    if (socket?.current) {
      socket.current.on('theinstantmess', handleNewMessage);
    }

    return () => {
      if (socket?.current) {
        socket.current.off('theinstantmess', handleNewMessage);
      }
    };
  }, [myuser, myuse._id, socket,currentchat]);

  useEffect(() => {
    const unreadMessages = nb2.filter((msg) => msg.read === 'false' || msg.read === '');
    setNb(unreadMessages.length);
  }, [nb2]);

  useEffect(() => {
    if (currentchat._id === myuse._id) {
      const getit=async()=>{
        const res1=await apiClient.put(`tchat/marasread/${currentchat._id}`) 
         setNb(0);
      }
      getit()
     
    }
  }, [currentchat, myuse._id]);
const onlinef=online.map((x)=>{
  return x.user._id
})

  return (
    <>
      <img
        src={a.profilepicture?a.profilepicture:'/assets/user.png'}
        alt="onlineami"
        style={{
          position: 'relative',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginTop: '2px',
          cursor: 'pointer',
        }}
      /> {onlinef.includes(a._id) && <span className="onlinbagee" style={{marginTop:'1px',marginLeft:'-22px',width:'8px',height:'8px',border:'3px solid white'}}></span>}
      <p style={{ marginTop: '10px' }}>{a?.username}</p>
      {nb !== 0 && nb2[nb2.length - 1]?.sender !== user?._id ? (
        <p
          style={{
            fontSize: '10px',
            padding: '7px',
            borderRadius: '50%',
            width: '9px',
            height: '9px',
            backgroundColor: '#e4e6eb',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '10px',
          }}
        >
          {nb}
        </p>
      ) : (
        ''
      )}
     
    </>
  );
};

export default Conversation;
