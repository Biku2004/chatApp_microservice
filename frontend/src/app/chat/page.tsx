"use client"

import React, { useEffect } from 'react'
import { useAppData } from '../context/AppContext'
import { useRouter } from 'next/router';
import Loading from '../components/Loading';

const ChatApp = () => {

  const {loading,isAuth} = useAppData();
  const router = useRouter();

  useEffect( ()=> {
    if(!loading && !isAuth) {
      router.push("/login");
    }

    
  }, [isAuth,router,loading]);
  
  if(loading) return <Loading />

  return (
    <div>Chat App</div>
  )


}

export default ChatApp