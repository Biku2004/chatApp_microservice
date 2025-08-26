/* eslint-disable*/

"user client"

import axios from 'axios';
import { ArrowRight, ChevronLeft, Loader2, Lock, Router, X } from 'lucide-react';
import { redirect, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useAppData, user_service } from '../context/AppContext';
import Loading from './Loading';
import toast from 'react-hot-toast';


const VerifyOtp = () => {
  
    const {isAuth,setIsAuth,setUser,loading:userLoading, fetchChats,fetchUsers} = useAppData();
    const router = useRouter();
    const [loading,setLoading] = useState(false);
    const [Otp, setOtp] = useState<string[]>(["","","","","","",""]);
    const [error, setError] = useState<string>("")
    const [resendLoading,setResendLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const searchParams = useSearchParams();
    const email:string = searchParams.get("email") || "";

    useEffect( ()=> {
        if(timer > 0){
        const interval = setInterval(()=>{
            setTimer((prev)=>prev-1)
        },1000);

        return ()=> clearInterval(interval)
        }
    },[timer]);

    // console.log(timer);

    const handleInputChange = (index:number, value:string):void => {
        if(value.length > 1) return;

        const newOtp = [...Otp]
        newOtp[index] = value;
        setOtp(newOtp);
        setError("");

        if(value && index < 5){
            inputRefs.current[index+1]?.focus();
        }
    };

    const handleKeyDown = (index:number,e: React.KeyboardEvent<HTMLElement>):void => {
        if(e.key === "Backspace" && !Otp[index] && index > 0){
            inputRefs.current[index-1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLElement>):void => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text");
        const digits = pastedData.replace(/\D/g,"").slice(0,6);

        if(digits.length === 6) {
            const newOtp = digits.split("");
            setOtp(newOtp);
            inputRefs.current[5]?.focus();
        }
    }

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const otpString = Otp.join("");

        if(otpString.length !== 6){
            setError("Please enter all 6-digit code");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const {data} = await axios.post(`http://localhost:5000/api/v1/verify`,{
                email,
                otp:otpString
            });

            toast.success(data.message);
            Cookies.set("token",data.token,{
                expires:15,
                secure:false,
                path:"/"
            });

            setOtp(["","","","","","",""]);
            inputRefs.current[0]?.focus();
            setUser(data.user);
            setIsAuth(true);
            fetchChats();
            fetchUsers();

        } catch (error:any) {
            setError(error.response.data.message);
        }
        finally{
            setLoading(false);
        }

    };

    const handleResendOtp = async () => {
        setResendLoading(true);
        setError("");
        try {
            const {data} = await axios.post(`${user_service}/api/v1/login`,{
                email
            });
            toast.success(data.message);
            setTimer(60);
        }
        catch(error:any){
            setError(error.response.data.message);
        }
        finally{
            setResendLoading(false);
        }
    }

    if(userLoading) return <Loading />

    if(!isAuth) redirect("/chat");

    return (
      <>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className='max-w-md w-full'>
                <div className='bg-gray-800 border-gray-700 rounded-lg p-8'>
                    
                    <div className='text-center mb-8 relative'>

                      <button className='absolute top-0 left-0 p-2 text-gray-300
                       hover:text-white' onClick={() => router.push("/login")}>
                        <ChevronLeft className='w-6 h-6'/>
                      </button>
                        
                        <div className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                            <Lock size={40} className='text-white' />
                        </div>
                        <h1 className='text-4xl fondt-bold text-white mb-3'>
                            Verify Your Email
                        </h1>
                        <p className='text-gray-300 text-lg'>
                            we have sent a 6-digit-code to 
                        </p>
                        <p className='text-blue-400 font-medium'>{email}</p>
                    </div>

                    <form className='space-y-6' onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor='email' className='block text-sm font-medium text-gray-300 mb-4 text-center'>
                                Enter Your 6 digit otp here
                            </label>

                            <div className='flex justify-center space-x-3'>
                                {Otp.map((digit, index) => (
                                    <input
                                      key={index}
                                      ref={(el: HTMLInputElement | null) => {
                                        inputRefs.current[index] = el;
                                      }}
                                      type='text'
                                      maxLength={1}
                                      value={digit}
                                      onChange={(e) => handleInputChange(index, e.target.value)}
                                      onKeyDown={(e) => handleKeyDown(index, e)}
                                      onPaste={index === 0 ? handlePaste : undefined}
                                      className='w-12 h-12 text-center text-xl font-bold border border-gray-600 rounded-lg bg-gray-700 text-white'
                                    />
                                ))}
                            </div>
                        </div>

                        {error && 
                            <div className='bg-red900 border border-red-700 rounded-lg p-3'>
                                <p className='text-red-300 text-sm text-center'>{error}</p>
                            </div>
                        }

                        <button type='submit' className='w-full bg-blue-600 text-white py-4
                         px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 
                         disabled:cursor-not-allowed' disabled={loading}>
                            {
                                loading ? (
                                    <div className='flex items-center justify-center gap-2'>
                                        <Loader2 className='w-5 h-5' />
                                        Verifying...
                                    </div>
                                ):(
                                    <div className='flex items-center justify-center gap-2'>
                                        <span>Verify</span>
                                        <ArrowRight  className='w-5 h-5' />
                                    </div>
                                )
                            }
                        </button>

                    </form>

                    <div className='mt-6 text-center'>
                        <p className='text-gray-300 text-sm'>
                            Didn't receive the code?
                        </p>
                          {
                            timer > 0 ? (
                            <p className='text-gray-400 text-sm'>Resend code in {timer} seconds</p>
                          ) : (
                              <button className='text-blue-400 text-sm font-medium
                               disabled:opacity-50' disabled={resendLoading} onClick={handleResendOtp}>
                                {resendLoading ? "Sending..." : "Resend Code"}
                              </button>
                            ) 
                          }
                    </div>

                </div>
            </div>
        </div>  

      </>
    )
}

export default VerifyOtp;