// "use client";
// import dbConnect from '@/db/dbConnection';
// import { signIn, signOut } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// //import { registerUser } from '@/server/actions/user/action';
// import React, { useState } from 'react';

// const Page = () => {
//   const router = useRouter();
//     const [formData, setFormData] = useState({ email: '', password: '' });
//     const [isSign, setSign] = useState(false);

//   const handleClick = async () => {
//     try {
//       await dbConnect();
//       alert('Database connected successfully!');
//     } catch (error) {
//       console.error('Error connecting to the database:', error);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//       e.preventDefault();
//     // const signin = await fetch("api/users/login-user", { method: "POST", headers: { "Content-Type": "application/json", }, body: JSON.stringify(formData) });
//     // if (signin.status === 200) { console.log("created account"); }
//     //   if (signin.status === 201) { setSign(true); }
//       //const signup = await registerUser(formData);
//     //console.log(signup);
//     //const signAuth = await signIn("credentials", { formData, redirect: false });
//     const signAuth = await signIn("google");
//     router.replace("/home");
//     console.log(signAuth);
//     if (signAuth?.ok) setSign(true);
//     if (signAuth?.error) {
//       console.log(signAuth.error);
//     }
//   };

//   return (
//     <>
//       <h1 className="text-3xl p-9 m-16">This is to check DB connection</h1>
//       <button onClick={handleClick} className="p-4 rounded-md bg-green-300">
//         Connect to DB
//       </button>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Email"
//           value={formData.email}
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//           className="block my-4 p-2 border rounded-md text-black"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//           className="block my-4 p-2 border rounded-md text-black"
//         />
//         <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
//           Sign Up
//         </button>
//           </form>
//       {isSign && <><h1 className='text-5xl p-5 rounded bg-slate-200 text-black'>signed in guys</h1>
//         <button onClick={()=>signOut()} className='text-4xl bg-red-500 text-black'>sign out</button>
//       </>}
//       <button onClick={() => signOut()} className='text-4xl bg-red-500 text-black'>sign out</button>
      
//     </>
//   );
// };

// export default Page;

"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Page = () => {
  const { data: session, status } = useSession(); // Track session
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (status === "authenticated") {
      // If session is authenticated, redirect to home
      router.push("/");
    }
  }, [status]);

  const handleGoogleSignIn = async () => {
    const signAuth = await signIn("google", { redirect: false });

    if (signAuth?.ok) {
      router.push("/"); // Redirect to the home page
    } else if (signAuth?.error) {
      console.error(signAuth.error);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const register = await fetch("api/users/register-user", { method: "POST", headers: { "Content-Type": "application/json", }, body: JSON.stringify(formData) });
    if (register.ok) { console.log("user is successfully registered- ", register.json()); }

  }
  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const signAuth = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (signAuth?.ok) {
      router.push("/"); // Redirect to home page
    } else if (signAuth?.error) {
      console.error(signAuth.error);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>; // Display a loading state while session is being checked
  }

  if (status === "authenticated") {
    return (
      <>
        <h1 className="text-5xl p-5 rounded bg-slate-200 text-black">
          Welcome, {session.user?.email || "User"}!
        </h1>
        <button
          onClick={() => signOut()}
          className="text-4xl bg-red-500 text-black"
        >
          Sign Out
        </button>
      </>
    );
  }

  return (
    <>
      <h1 className="text-3xl p-9 m-16">Sign In</h1>
      <form onSubmit={handleCredentialsSignIn}>
        <input
          type="text"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="block my-4 p-2 border rounded-md text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="block my-4 p-2 border rounded-md text-black"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
          Sign In with Credentials
        </button>
      </form>
      <button
        onClick={handleGoogleSignIn}
        className="mt-4 p-2 bg-red-500 text-white rounded-md"
      >
        Sign In with Google
      </button>
      <button
        onClick={handleSignUp}
        className="mt-4 p-2 bg-blue-800 text-white rounded-md"
      >
       Sign up
      </button>
    </>
  );
};

export default Page;
