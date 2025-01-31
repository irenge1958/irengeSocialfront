import React, { useContext, useState, useEffect, useRef } from 'react';
import Toolbar from "../toolbar/toolbar";
import './tchat.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Message from "../message/message";
import { Usercontext } from '../contextapi/contextlogin';
import axios from 'axios';
import Conversation from "./conversation";
import { useMediaQuery } from 'react-responsive';

const Tchat = ({ socket, onlinefriend, allonlinefriend }) => {
  const isDesktop = useMediaQuery({ minWidth: 1224 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1224 });
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { user } = useContext(Usercontext);

  const [myfriend, setMyfriend] = useState([]);
  const [result, setResults] = useState([]);
  const [message, setMessages] = useState([]);
  const [arrivalmessage, setarrivalMessages] = useState({});
  const [b, setB] = useState({});
  const [currenttchat, setCurrentchat] = useState('');
  const scrollref = useRef(null);
  const monmessage = useRef();

  useEffect(() => {
    socket.current.on('theinstantmess', ({ senderid, text, maconv }) => {
      setarrivalMessages({
        messagee: text,
        sender: senderid,
        maconv: maconv,
        createdAt: Date.now(),
      });
    });
  }, [socket]);

  useEffect(() => {
    if (arrivalmessage && currenttchat.members?.includes(arrivalmessage.sender)) {
      setMessages((prev) => [...prev, arrivalmessage]);
    }

    if (arrivalmessage.maconv?.date === '') {
      const getConversations = async () => {
        const res = await axios.get(`/tchat/conversation/${user._id}`);
        setMyfriend(res.data.sort((p1, p2) => new Date(p2.updatedAt) - new Date(p1.updatedAt)));
      };
      getConversations();
    }
  }, [arrivalmessage, currenttchat.members, user]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(`tchat/message/${currenttchat._id}`, {
      senderid: user._id,
      message: monmessage.current.value,
    });

    setMessages([...message, res.data]);

    const myuser = currenttchat.members?.find((s) => s !== user?._id);
    socket.current.emit('getmessage', {
      senderid: user._id,
      text: monmessage.current.value,
      recieverdid: myuser,
      maconv: currenttchat,
    });

    monmessage.current.value = '';
  };

  useEffect(() => {
    const fetchConversations = async () => {
      const res = await axios.get(`/tchat/conversation/${user?._id}`);
      setMyfriend(res.data.sort((p1, p2) => new Date(p2.updatedAt) - new Date(p1.updatedAt)));
    };
    fetchConversations();
  }, [message.length, currenttchat._id, user]);

  const search = async (q) => {
    if (q) {
      const myfriends = await axios.get(`users/search/${q}`);
      setResults(myfriends.data);
    } else {
      setResults([]);
    }
  };

  const getconv = async (id, conv) => {
    const res = await axios.get(`tchat/message/${id}`);
    if (message?.[message.length - 1]?.sender !== user._id) {
      await axios.put(`tchat/marasread/${id}`);
    }

    setCurrentchat(conv);
    setMessages(res.data);

    const myuser = conv.members?.find((s) => s !== user?._id);
    const res2 = await axios.get(`users/${myuser}`);
    setB(res2.data);
  };

  useEffect(() => {
    if (scrollref.current) {
      scrollref.current.scrollTo({
        top: scrollref.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [message]);

  const bgcolor = JSON.parse(localStorage.getItem('color')) === 'black'
    ? { backgroundColor: 'black', color: 'white' }
    : { backgroundColor: 'white' };

  const monamie = async (id) => {
    const res = await axios.get(`/tchat/messagefromconv/${user._id}/${id}`);
    const myconv = res.data[0]?._id;

    if (res.data.length !== 0) {
      const res1 = await axios.get(`tchat/message/${myconv}`);
      setCurrentchat(res.data[0]);
      setMessages(res1.data);
    } else {
      const res2 = await axios.post(`tchat/createconv/${user._id}/${id}`);
      if (res2.data) {
        const res3 = await axios.get(`tchat/message/${res2.data._id}`);
        setCurrentchat(res2.data);
        setMessages(res3.data);
      }
    }
  };

  const onlinef = allonlinefriend.map((x) => x.user._id);

  return (
    <>
      <div className="mychat" style={{ overflow: 'hidden' }}>
        <Toolbar socket={socket} arrivalmessage={arrivalmessage} />
        <div className="allmytchat" style={bgcolor}>
          <br />
          {/* Desktop View */}
          {!isMobile && (
            <div className="conversation">
              <h1 style={{ marginTop: '10px' }}>Conversations</h1>
              <input
                type="text"
                style={{
                  border: 'none',
                  borderBottom: '1px solid gray',
                  marginTop: '30px',
                  marginLeft: '10px',
                }}
                placeholder="Search for friends"
                onChange={(e) => search(e.target.value)}
              />
              {/* Render Results */}
              {result.length !== 0
                ? result.map((a) => (
                    <div
                    key={a._id}
                      className="myconv"
                      onClick={() => monamie(a._id)}
                      style={{
                        display: 'flex',
                        gap: '10px',
                        marginTop: '10px',
                        marginBottom: '10px',
                        cursor: 'pointer',
                        padding: '10px',
                      }}
                    >
                      <img
                        src={a.profilepicture ?a.profilepicture: '/assets/user.png'}
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
                      />
                      <p style={{ marginTop: '10px' }}>{a.username}</p>
                    </div>
                  ))
                : myfriend?.map((a) => (
                    <div
                    key={a._id}
                      className="myconv"
                      onClick={() => getconv(a._id, a)}
                      style={{
                        display: 'flex',
                        gap: '10px',
                        marginTop: '10px',
                        marginBottom: '10px',
                        cursor: 'pointer',
                        padding: '10px',
                      }}
                    >
                      <Conversation
                        user={user}
                        myuse={a}
                        online={allonlinefriend}
                        socket={socket}
                        notifcation={message}
                        currentchat={currenttchat}
                        key={a._id}
                      />
                    </div>
                  ))}
            </div>
          )}
          {isMobile && currenttchat ==='' && (
            <div className="conversation">
              <h1 style={{ marginTop: '10px' }}>Conversations</h1>
              <input
                type="text"
                style={{
                  border: 'none',
                  borderBottom: '1px solid gray',
                  marginTop: '30px',
                  marginLeft: '10px',
                }}
                placeholder="Search for friends"
                onChange={(e) => search(e.target.value)}
              />
              {/* Render Results */}
              {result.length !== 0
                ? result.map((a) => (
                    <div
                    key={a._id}
                      className="myconv"
                      onClick={() => monamie(a._id)}
                      style={{
                        display: 'flex',
                        gap: '10px',
                        marginTop: '10px',
                        marginBottom: '10px',
                        cursor: 'pointer',
                        padding: '10px',
                      }}
                    >
                      <img
                        src={a.profilepicture ?a.profilepicture: '/assets/user.png'}
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
                      />
                      <p style={{ marginTop: '10px' }}>{a.username}</p>
                    </div>
                  ))
                : myfriend?.map((a) => (
                    <div
                    key={a._id}
                      className="myconv"
                      onClick={() => getconv(a._id, a)}
                      style={{
                        display: 'flex',
                        gap: '10px',
                        marginTop: '10px',
                        marginBottom: '10px',
                        cursor: 'pointer',
                        padding: '10px',
                      }}
                    >
                      <Conversation
                        user={user}
                        myuse={a}
                        online={allonlinefriend}
                        socket={socket}
                        notifcation={message}
                        currentchat={currenttchat}
                        key={a._id}
                      />
                    </div>
                  ))}
            </div>
          )}
    {!isMobile && <div className="tchat">
            {currenttchat !=='' && <div style={{display:'flex',gap:'10px',padding:'5px',backgroundColor:'rgb(201, 201, 201)'}}>   <img style={{width:'40px',height:'40px',borderRadius: '50%',objectFit: 'cover',marginTop: '8px'}} src={b.profilepicture?`/assets/${b?.profilepicture}`:'/assets/user.png'} />{onlinef.includes(b._id) && <span style={{marginTop:'5px',marginLeft:'-22px',width:'8px',height:'8px',border:'3px solid white'}} className="onlinbagee" ></span>}<p style={{marginTop:'15px',fontWeight:'bolder'}}>{b?.username}</p></div>}
                <div className="mymessagess"  ref={scrollref}>   
                {message?.map((a)=>{return<Message own={a.sender===user._id?true:false} a={a} currenttchat={currenttchat} />})}
                </div> 
        {message.length!==0 || currenttchat!==''?<div ><form className="mytextareaform" onSubmit={handlesubmit}>
    <textarea className="mytextarea" ref={monmessage} required></textarea>
    <button type='submit' className='mybuttform'>send</button>
    </form></div>:''}       
            </div>}   
            {isMobile && currenttchat !==''?<div className="tchat" style={{height:'75vh'}}>
            {currenttchat !=='' && <div style={{display:'flex',gap:'10px',padding:'5px',backgroundColor:'rgb(201, 201, 201)'}}>{isMobile && <span style={{marginTop:'13px'}} onClick={()=>{setCurrentchat('')}}><ArrowBackIcon /></span>}<img style={{width:'40px',height:'40px',borderRadius: '50%',objectFit: 'cover',marginTop: '8px'}} src={b.profilepicture?`/assets/${b?.profilepicture}`:'/assets/user.png'} />{onlinef.includes(b._id) && <span  className="onlinbagee" style={{marginTop:'5px',marginLeft:'-22px',width:'8px',height:'8px',border:'3px solid white'}} ></span>}<p style={{marginTop:'15px',fontWeight:'bolder'}}>{b?.username}</p></div>}
                <div className="mymessagess"  ref={scrollref}>   
                {message?.map((a)=>{return<Message own={a.sender===user._id?true:false} a={a} currenttchat={currenttchat} />})}
                </div> 
        {message.length!==0 || currenttchat!==''?<div ><form style={{padding:'10px',marginTop:'4px'}} className="mytextareaform" onSubmit={handlesubmit}>
    <textarea className="mytextarea"  ref={monmessage} required></textarea>
    <button type='submit' className='mybuttform'>send</button>
    </form></div>:''}       
            </div>:''}       
        
            {!isMobile && <div className="onlinefriend">
            <h1>Online Friends</h1>
             {onlinefriend?.length!==0?onlinefriend?.map((x)=>{
                return<div onClick={()=>monamie(x.user?._id)} style={{display:'flex',gap:'10px',marginTop:'10px',marginBottom:'10px',cursor:'pointer'}} >
                <img src={x.user.profilepicture?`/assets/${x.user.profilepicture}`:'/assets/user.png'} alt="onlineami" style={{
             position: 'relative',
             width:'45px',
             height:'45px',
             borderRadius: '50%',
         objectFit: 'cover',
          marginTop: '2px',cursor:'pointer'
        }}  /> <span className="onlinbagee" ></span> <p style={{marginTop:'10px'}}>{x.user?.username}</p>
            </div>
             }):<div style={{display:'flex',gap:'10px',marginTop:'10px',marginBottom:'10px'}}><p style={{marginTop:'10px'}}>NO friend online</p></div>}   </div>
}
        </div>
      </div>
    </>
  );
};

export default Tchat;
