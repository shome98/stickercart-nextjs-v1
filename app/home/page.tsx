"use client"
import { signOut, useSession } from "next-auth/react";
import { FormEvent, useState } from "react";

const Home = () => {
  const data = useSession();
  //console.log("data is there", data);
  const [title, setTitle] = useState("");
  
  async function createCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const send = await fetch("api/categories/create-category", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({title}) });
    if (send.ok) console.log("category created ", send.json());
    //throw new Error("Function not implemented.");
  }

    //console.log(token);

    return <><h1>This is home page</h1>
        {data.status==="authenticated"&&<button
        onClick={() => { signOut(); }}
          className="text-4xl bg-red-500 text-black rounded-md p-2"
        >
          Sign Out
      </button>}
      <form onSubmit={createCategory}>
        <input type="text" value={title} onChange={(e) => { console.log(title); setTitle(e.target.value)}} placeholder="title here" className="text-black" />
        <button type="submit">create category</button>
      </form>
    </>
}
export default Home;