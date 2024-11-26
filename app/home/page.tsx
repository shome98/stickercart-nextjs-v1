"use client"
import { signOut, useSession } from "next-auth/react";
import { NextRequest } from "next/server";

const Home = () => {
  const data = useSession();
  console.log("data is there", data);
  
    //console.log(token);

    return <><h1>This is home page</h1>
        {data.status==="authenticated"&&<button
        onClick={() => { signOut(); }}
          className="text-4xl bg-red-500 text-black"
        >
          Sign Out
        </button>}
    </>
}
export default Home;