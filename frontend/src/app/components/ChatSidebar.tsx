import React, { useState } from 'react'
import { User } from '../context/AppContext';
import { MessageCircle, Plus, X } from 'lucide-react';

interface ChatSidebarProps {
  // Define any props your ChatSidebar might need
    sidebarOpen:boolean;
    setSidebarOpen: (open:boolean)=>void;
    showAllUsers: boolean;
    setShowAllUsers: (show:boolean | ((prev:boolean) => boolean))=>void;
    users: User[] | null;
    loggedInUser: User | null;
    chats: any[] | null;
    selectedUser: string | null;
    setSelectedUser: (userId:string | null)=>void;
    handleLogout: () => void;

}

const ChatSidebar = ( {
    sidebarOpen,
    setShowAllUsers,
    setSidebarOpen,
    showAllUsers,
    users,
    loggedInUser,
    chats,
    selectedUser,
    setSelectedUser,
    handleLogout
}: ChatSidebarProps) => {
    const [searchQuery,setSearchQuery] = useState("");
    
    return (
        <aside className={`fixed x-20 sm:static top-0 left-0 h-screen w-80 bg-gray-900 border-r border-gray-700 transform
            ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } sm:translate-x-0 transition-transform duration-300 flex flex-col
        `}>
            {/* header */}
            <div className='p-6 border-b border-gray-700'>
                <div className='sm:hidden flex justify-end mb-0'>
                    <button 
                    onClick={()=>setSidebarOpen(false)}
                    className='p-2 hover:bg-gray-700 rounded-lg transition-colors'>
                        <X className='w-5 h-5 text-gray-300'/>
                    </button>
                </div>

                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='p-2 bg-blue-600 justify-between'>
                            <MessageCircle className='w-5 h-5 text-white'/>
                        </div>
                        <h2 className='text-xl font-bold text-white'>
                            {showAllUsers ? "New Chat" : "Messages"}
                        </h2>
                    </div>

                    <button className={`p-2.5 rounded-lg transition-colors
                            ${
                                showAllUsers ? 
                                "bg-red-600 hover:bg-red-700 text-white" : 
                                "bg-green-600 hover:bg-green-700 text-white" 
                            }
                        `} 
                        onClick={()=>setShowAllUsers((prev)=> !prev)}
                    >
                        {
                            showAllUsers ? (
                            <X className='w-4 h-4' />
                        ) : (
                            <Plus className='w-4 h-4'/>
                        )}
                    </button>

                </div>

            </div>    


        </aside>
    )
}

export default ChatSidebar