import { motion } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";
import { API_BASE_URL } from "../util";
import { useNavigate } from "react-router-dom";
type FormData = {
  name?: string;
  email?: string;
  password: string;
  username: string;
};
function AdminAuth() {
  const [loading, setLoading] = useState(false);
  const [logInForm, setLoginForm] = useState<FormData>({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logInForm),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem("token", data.id);
        navigate(`/admin/${data.id}`);
        alert("Admin Logged In Successfully");
      } else {
        alert(data.message);
      }
      setLoginForm({
        username: "",
        password: "",
      });
    } catch (error) {
      alert(JSON.stringify(error));
    }
    setLoading(false);
  }
  useEffect(() => {
    const id = sessionStorage.getItem("token");
    if (id) {
      navigate(`/admin/${id}`);
    }
  }, [navigate]);
  return (
    <div className="bg-zinc-200 w-full h-screen flex justify-start items-center overflow-hidden">
      <div className="w-1/2 h-screen p-2 bg-center overflow-hidden">
        <img
          className="w-full h-full object-cover rounded-xl"
          src="/auth-bigfoot.png"
        />
      </div>
      <div className="w-1/2 h-full p-4 ">
        <div className="w-full flex justify-center items-center gap-2">
          <img src="/LOGO.png" className="w-6 h-6" />
          <h1 className="text-sm">Bigfoot Publications</h1>
        </div>
        <div className="w-full h-full flex flex-col justify-evenly items-center gap-2">
          <div className="flex flex-col gap-1 justify-center items-center mt-4">
            <h1 className="text-4xl">Admin Auth</h1>
          </div>

          {/* FORM  */}
          <div className="w-full p-2 overflow-hidden h-[65%] flex justify-start items-center relative">
            {/* LOGIN FORM  */}
            <motion.form
              onSubmit={handleLogin}
              className="w-full flex flex-col p-4 gap-2 absolute top-0 left-0"
            >
              <div className="flex flex-col gap-1">
                <label className="text text-base">Username</label>
                <input
                  value={logInForm.username}
                  onChange={(e) =>
                    setLoginForm({
                      ...logInForm,
                      [e.target.id]: e.target.value,
                    })
                  }
                  id="username"
                  placeholder="Unique Username"
                  className="w-full p-1 px-2 bg-zinc-300 rounded-full focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text text-base">Password</label>
                <input
                  type="password"
                  value={logInForm.password}
                  onChange={(e) =>
                    setLoginForm({
                      ...logInForm,
                      [e.target.id]: e.target.value,
                    })
                  }
                  id="password"
                  placeholder="Your Valid Password"
                  className="w-full p-1 px-2 bg-zinc-300 rounded-full focus:outline-none"
                />
              </div>
              <div className="w-full flex justify-end items-center p-2 gap-2">
                <button className="py-2 px-4 bg-black rounded-full text-base text-white">
                  Forgot Password
                </button>
                <button className="py-2 px-4 bg-yellow-500 hover:bg-yellow-500  rounded-full text-base text-white">
                  {loading ? "Loading..." : "Login"}
                </button>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAuth;
