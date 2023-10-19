import React, { createContext, useContext, useEffect, useState } from 'react';
import $ from 'jquery';
import { useDispatch } from 'react-redux';
import { changeInitialPlayStatus, iconStatus } from './redux/musicStatusSlice';

const LoginContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [darkmodeSet,setDarkmode] = useState(false);
  useEffect(() => {
    console.log(sessionStorage.getItem('user'));
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
  }, []);

  const login = (userData) => {
    sessionStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setDarkmode(!darkmodeSet);
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
    pauseMusic();
  };

  const dispatch = useDispatch();
  function pauseMusic(){
    const music = document.getElementById("musicPlayer-audio");
    music.pause();
    $("#musicPlayer-audio").prop("currentTime", 0);
    $("#muzipbar-player").addClass("played");
    $("#normal-soundbar-image").attr("src", "http://localhost:8082/Muzip/resources/image/stopsound.png");
    dispatch(iconStatus({
        type : "changePlayStatus",
        playStatus : false
    }));
    dispatch(changeInitialPlayStatus(0));
  };
  const arr = "dd";
  return (
    <LoginContext.Provider value={{ user,setUser, login, logout,darkmodeSet,setDarkmode }}>
      {children}
    </LoginContext.Provider>
  );
}

export function useAuth() {
  return useContext(LoginContext);
}
