  import React, { useState } from "react";
  import { Link, useNavigate } from "react-router-dom";

  const Login = () => {
    const [form, setForm] = useState({
      email: "",
      password: ""
    });

    const navigate = useNavigate();

  const handleChange =(e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }

    const handleSubmit =  async(e)=>{
      e.preventDefault()
      try{
        const response = await fetch("http://localhost:3000/user/login",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(form)

        })
        console.log(response);
        
        
        
        const data  = await response.json();
        console.log(data);
        if(!response.ok)
        {
          alert(data.msg)
          return
        }
        localStorage.setItem("token",data.token)
        alert("Login SuccessFul")
        navigate('/home')
      }
      catch(err)
      {
        console.log(`Something Went Wrong ${err}`);
        
      }

    }

    return (
      <div className="min-h-screen bg-gradient-to-r flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Welcome Back
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email Id"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              
            />

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-5 text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
              Signup
            </Link>
          </p>
        </div>
      </div>
    );
  };

  export default Login;