import React, { useContext, useState, useEffect, useRef } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { Usercontext } from './component/contextapi/contextlogin';
import Toolbar from './component/toolbar/toolbar';
import Lefttside from './component/leftside/leftside';
import Feed from './component/feed/feed';
import Tchat from './component/tchat/tchat';
import Profile from './component/profile/profile';
import Rightside from './component/rightside/rightside';
import Register from './component/register/register';
import Linkpost from './component/feed/post/linkpost';
import Login from './component/Login/Login';
import './app.css';
import axios from 'axios';
import notification from './notification.mp3';
import useSound from "use-sound";
import { useMediaQuery } from 'react-responsive';
import { io } from "socket.io-client"; // Updated import for io

function App() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get('username');
  const socket = useRef(io('http://localhost:5000')); // Updated socket initialization
  const [onlinefriend, setOnlinfriend] = useState([]);
  const [allonlinefriend, setAllOnlinfriend] = useState([]);
  const [mynot] = useSound(notification);

  const stick = {
    position: 'sticky',
    top: '60px',
    marginLeft: '5px',
    overflowY: 'scroll',
    height: '650px',
    flex: '3',
  };

  const { user } = useContext(Usercontext);

  useEffect(() => {
    if (user) {
      socket.current.emit('myuser', user);
      socket.current.on('mymess', (users) => {
        const u = users.filter((x) => x.user?._id !== user?._id);

        socket.current.on('theinstantmess', ({ senderid, text, maconv }) => {
          mynot();
          console.log({ senderid, text, maconv });
        });

        setAllOnlinfriend(u);
        const f = u.filter((a) => user.followings.includes(a.user._id) && user.followers.includes(a.user._id));
        setOnlinfriend(f);
      });

      const fetchNotifications = async () => {
        const res = await axios.get(`users/${user._id}`);
        if (res.data.notifications.length !== user.notifications.length) {
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      };
      fetchNotifications();
    }
  }, [user]);

  const contents = JSON.parse(localStorage.getItem('color')) === 'black'
    ? { backgroundColor: 'black', color: "white" }
    : { backgroundColor: 'white' };

  const isDesktop = useMediaQuery({ minWidth: 1224 });
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const myphone = isMobile ? { margin: 'auto', top: '0', right: '0', left: '0', bottom: '0' } : {};

  return (
    <Switch>
      <Route exact path='/'>
        {!user ? (
          <div style={myphone}><Login /></div>
        ) : (
          <>
            <Toolbar socket={socket} />
            <div className='contents' style={contents}>
              {!isMobile && <div style={stick}><Lefttside /></div>}
              <div className='wrapperprf'>
                <div className='profile'>
                  {username && <Profile />}
                </div>
                <div className='wrapperrf'>
                  <Feed />
                  {!isMobile && <Rightside onlinefriend={onlinefriend} />}
                </div>
              </div>
            </div>
          </>
        )}
      </Route>
      <Route path='/register'><Register /></Route>
      <Route path='/linkpost'><Linkpost /></Route>
      <Route path='/tchat'>
        {user ? (
          <Tchat onlinefriend={onlinefriend} allonlinefriend={allonlinefriend} socket={socket} />
        ) : <Login />}
      </Route>
    </Switch>
  );
}

export default App;
