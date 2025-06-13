import React, { useState } from 'react'
import { ShipWheelIcon } from 'lucide-react'
import { Link } from 'react-router'


import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { signup } from '../lib/api';

const Signup = () => {

  const [showpassword, setShowpassword] = useState(false);

  const [signupdata, setSignupdata] = useState({
    fullname: "",
    email: "",
    password: "",
  })


  const queryClint=useQueryClient();

  const{mutate:signupMutation ,isPending, error}=useMutation({
     mutationFn: signup,
     onSuccess: ()=>queryClint.invalidateQueries({queryKey:["authuser"]}),
     
  })

  const submithandler = async (e) => {
    e.preventDefault();
    signupMutation(signupdata)
  }

  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme="forest">
      <div className='border border-primary/25 flex lg-flex-row w-full max-w-5xl mx-auto bg-base-100
       rounded-xl shadow-lg overflow-hidden'>

        {/* sign up form -leftside */}
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col  '>
          <div className='mb-4 flex items-center justify-start gap-2'>
            <ShipWheelIcon className="size-9 text-primary" />
            <span className='text-3xl font-bold  font-mono bg-clip-text text-transparent bg-gradient-to-t from-primary
          to-secondary tracking-wider '>Streamigo </span>
          </div>


           {/* ERROR MASSAGE IF ANY*/}
           {error && (
            <div className="alert alert-error mb-4">
              <span>{error?.response?.data?.message}</span>
            </div>
          )}


          <div className='w-full '>
            <form onSubmit={submithandler} >
              <div className='space-y-4 '>
                <div>
                  <h2 className='text-xl font-semibold '>Create An Account</h2>
                  <p className='text-sm opa-70 '>join streamify and start your language learning adventure!</p>
                </div>

                <div className='space-y-3 '>

                  <div className='form-control w-full '>
                    <label className='label'>
                      <span className='label-text '>Full Name</span>
                    </label>

                    <input
                      value={signupdata.fullname}
                      onChange={(e) => {
                        setSignupdata({ ...signupdata, fullname: e.target.value })
                      }}
                      required
                      type="text" placeholder='Your name' className='input input-bordered w-full  ' />

                  </div>


                  <div className='form-control w-full '>
                    <label className='label'>
                      <span className='label-text '>Email</span>
                    </label>

                    <input
                      value={signupdata.email}
                      onChange={(e) => {
                        setSignupdata({ ...signupdata, email: e.target.value })
                      }}
                      required
                      type="email" placeholder='example@gmail.com' className='input input-bordered w-full  ' />

                  </div>

                  {/* password */}
                  <div className='form-control w-full relative'>
                    <label className='label'>
                      <span className='label-text '>Password</span>
                    </label>

                    <input
                      value={signupdata.password}
                      onChange={(e) => {
                        setSignupdata({ ...signupdata, password: e.target.value })
                      }}
                      required
                      type={showpassword ? "text" : "password"} placeholder='******' className='input input-bordered w-full  ' />

                    {/* when showpassword is false */}
                    {!showpassword && <IoMdEye onClick={() => {
                      setShowpassword(true)
                    }} className='absolute top-[48px] right-[20px] text-white h-[20px] cursor-pointer ' />}

                    {/* when showpassword is true */}
                    {showpassword && <IoMdEyeOff onClick={() => {
                      setShowpassword(false)
                    }} className='absolute top-[48px] right-[20px] text-white h-[20px] cursor-pointer ' />}

                    <p className='text-xs opacity-70 mt-1 '>Password must be at least 6 characters long</p>
                  </div>


                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox checkbox-sm" required />
                      <span className="text-xs leading-tight">
                        I agree to the{" "}
                        <span className="text-primary hover:underline">terms of service</span> and{" "}
                        <span className="text-primary hover:underline">privacy policy</span>
                      </span>
                    </label>
                  </div>


                </div>


                <button className='btn btn-primary w-full ' type='submit'>
                  {isPending ? (
                    <>
                    <span className=' loading loading-spinner loading-xs  '>Loading...</span>
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/Login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>

              </div>
            </form>
          </div>

        </div>


        {/* sign up form -rightside */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/Video call-bro.png" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>


      </div>

    </div>
  )
}

export default Signup