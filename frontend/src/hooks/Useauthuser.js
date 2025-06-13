import { useQuery } from "@tanstack/react-query"
import { getAuthuser } from "../lib/api"

  const Useauthuser = () => {
    const authuser = useQuery({
      queryKey:["authuser"],
  
      queryFn: getAuthuser,
      retry:false,
    })
 

    return {isLoading:authuser.isLoading , authuser:authuser.data?.user}
 }
 
 export default Useauthuser