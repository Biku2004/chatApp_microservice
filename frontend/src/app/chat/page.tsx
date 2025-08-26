"use client"

import React, { useEffect, useState } from 'react'
import { useAppData, User } from '../context/AppContext'
import { useRouter } from 'next/navigation';
import Loading from '../components/Loading';
import ChatSidebar from '../components/ChatSidebar';

export interface Message{
  _id:string;
  chatId:string;
  sender:string;
  text?:string;
  image:{
    url:string;
    publicId:string;
  };

  messageType:"text" | "image";
  seen: boolean;
  seenAt? : string;
  createdAt:string;

}

const ChatApp = () => {

  const { loading, isAuth, logoutUser, chats, user:loggedInUser, users, fetchChats, setChats} = useAppData();
  const [message, setMessage] = useState("");
  const [selectedUser,setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [sidebarOpen,setSidebarOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeOut, setTypingTimeOut] = useState<NodeJS.Timeout | null>(null);
  

  const router = useRouter();

  useEffect( ()=> {
    if(!loading && !isAuth) {
      router.push("/login");
    }

    
  }, [isAuth,router,loading]);

  const handleLogout = () => logoutUser();
  
  if(loading) return <Loading />

  return (
    <div className='min-h-screen flex bg-gray-900 text-white relative overflow-hidden'>
      
      <ChatSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} 
      showAllUsers={showAllUsers} setShowAllUsers={setShowAllUsers} users={users}
      loggedInUser={loggedInUser} chats={chats} selectedUser={selectedUser} setSelectedUser={setSelectedUser} 
      handleLogout={handleLogout}
      />
    </div>
  )


}

export default ChatApp