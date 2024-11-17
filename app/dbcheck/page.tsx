"use client";
import dbConnect from '@/db/dbConnection';
//import { registerUser } from '@/server/actions/user/action';
import React, { useState } from 'react';

const Page = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isSign, setSign] = useState(false);

  const handleClick = async () => {
    try {
      await dbConnect();
      alert('Database connected successfully!');
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const signin = await fetch("api/users/register-user", { method: "POST", headers: { "Content-Type": "application/json", }, body: JSON.stringify(formData) });
      if (signin.status === 200) { setSign(true); }
      //const signup = await registerUser(formData);
      //console.log(signup);
  };

  return (
    <>
      <h1 className="text-3xl p-9 m-16">This is to check DB connection</h1>
      <button onClick={handleClick} className="p-4 rounded-md bg-green-300">
        Connect to DB
      </button>
      <form onSubmit={handleSubmit}>
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
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="block my-4 p-2 border rounded-md text-black"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
          Sign Up
        </button>
          </form>
          {isSign&&<h1 className='text-5xl p-5 rounded bg-slate-200 text-black'>signed in guys</h1>}
    </>
  );
};

export default Page;
