import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { getoutgoingfriendreqs, getRecomendedUsers, getUserfriends, sendfriendrequest } from '../lib/api';
import { Link } from 'react-router';
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import Friendcard, { getLanguageFlag } from '../component/Friendcard';
import Nofriendsfound from '../component/Nofriendsfound';

const Home = () => {

  const queryClient = useQueryClient();

  const [outgointrequest, setOutgointrequest] = useState(new Set())
 
  const {data:friends=[],isLoading:loadingfriends}=useQuery({
    queryKey:["friends"],
  
      queryFn: getUserfriends,
      retry:false,
  })

  const {data:recommendedUsers=[],isLoading:loadingusers}=useQuery({
    queryKey:["users"],
  
      queryFn: getRecomendedUsers,
      retry:false,
  })
//for all get methods use useQuery
  const {data:outgoingfriendreqs=[]}=useQuery({
    queryKey:["outgoingfriendreqs"],
  
      queryFn: getoutgoingfriendreqs,
      retry:false,
  })



  //and for POST request use Mutation 

  const{mutate:sendRequest ,isPending}=useMutation({
     mutationFn: sendfriendrequest,
     onSuccess: ()=>queryClient.invalidateQueries({queryKey:["outgoingfriendreqs"]}),
     
  })

  useEffect(()=>{
     const outgoingIds=new Set()
     if(outgoingfriendreqs && outgoingfriendreqs.length > 0){
      outgoingfriendreqs.forEach((req)=>{
        outgoingIds.add(req.recipient._id)
      })
      setOutgointrequest(outgoingIds)
     }
  },[outgoingfriendreqs])
  


  return (
    <div className="p-4 sm:p-6 lg:p-8">
    <div className="container mx-auto space-y-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
        <Link to="/notification" className="btn btn-outline btn-sm">
          <UsersIcon className="mr-2 size-4" />
          Friend Requests
        </Link>
      </div>

      {loadingfriends ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : friends.length === 0 ? (
        <Nofriendsfound />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {friends.map((friend) => (
            <Friendcard key={friend._id} friend={friend} />
          ))}
        </div>
      )}

      <section>
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
              <p className="opacity-70">
                Discover perfect language exchange partners based on your profile
              </p>
            </div>
          </div>
        </div>

        {loadingusers ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : recommendedUsers.length === 0 ? (
          <div className="card bg-base-200 p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
            <p className="text-base-content opacity-70">
              Check back later for new language partners!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedUsers.map((user) => {
              const hasRequestBeenSent = outgointrequest.has(user._id);

              return (
                <div
                  key={user._id}
                  className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="card-body p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar size-16 rounded-full">
                        <img src={user.profilepic} alt={user.fullname} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">{user.fullname}</h3>
                        {user.location && (
                          <div className="flex items-center text-xs opacity-70 mt-1">
                            <MapPinIcon className="size-3 mr-1" />
                            {user.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Languages with flags */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="badge badge-secondary">
                        {getLanguageFlag(user.native_language)}
                        Native: {capitialize(user.native_language)}
                      </span>
                      <span className="badge badge-outline">
                        {getLanguageFlag(user.learning_language)}
                        Learning: {capitialize(user.learning_language)}
                      </span>
                    </div>

                    {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                    {/* Action button */}
                    <button
                      className={`btn w-full mt-2 ${
                        hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                      } `}
                      onClick={() => sendRequest(user._id)}
                      disabled={hasRequestBeenSent || isPending}
                    >
                      {hasRequestBeenSent ? (
                        <>
                          <CheckCircleIcon className="size-4 mr-2" />
                          Request Sent
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="size-4 mr-2" />
                          Send Friend Request
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  </div>
  )
}

export default Home


export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);