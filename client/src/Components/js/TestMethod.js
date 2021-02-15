import { useState, useEffect } from "react";

import "./App.css";
import { API_HOST } from "./config";
const API = process.env.REACT_APP_API;

function TestMethod() {
  const [message, setMessage] = useState([]);
  const [input, setInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = input.trim();
    const resp = await fetch(`${API}/profile/${user}`);
    const data = await resp.json();
    console.log(data["_id"]);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const resp = await fetch(`${API_HOST}/adduser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name: "bodro",
        email: "bodro@yahoocom",
        password: "pass",
        gender: "M",
        dob: "20200101",
        photo_url: "myphoto",
      }),
    });

    const data = await resp;
    console.log(data);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const resp = await fetch(`${API_HOST}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name: "Huge Smith",
        email: "huge@yahoo.com",
        password: "myPass",
        gender: "M",
        photo_url: "myurl",
        mobile: "0933669933",
      }),
    });

    const data = await resp;
    console.log(data);
  };

  // Messaging methods
  const handleMessage = async (e) => {
    e.preventDefault();

    const resp = await fetch(`${API}/sendmessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name: "bodro",
        id: "boddro_id",
        message: "hello there",
      }),
    });
    const data = await resp;
    console.log(data);
  };

  const handleReceive = async (e) => {
    e.preventDefault();

    const resp = await fetch(`${API}/receivemessage`);
    const msg = await resp.json();
    console.log(msg);
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button disabled={!input} className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
      <div>
        {message ? (
          <div>
            <h1>Name: {message.user_name}</h1>
            <h5>Email: {message.email}</h5>
            <h5>Password: {message.password}</h5>
          </div>
        ) : null}
      </div>
      <div>
        <button onClick={handleAddUser}>Add User</button>
      </div>
      <div>
        <button onClick={handleUpdateProfile}>Update profile</button>
      </div>
      <div>
        <button onClick={handleMessage}>send message</button>
      </div>
      <div>
        <button onClick={handleReceive}>get message</button>
      </div>
    </div>
  );
}

export default TestMethod;
