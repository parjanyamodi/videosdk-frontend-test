import { useState } from "react";
import Cookies from "universal-cookie";
import cryptoJs from "crypto-js";
import { useNavigate } from "react-router-dom";

import baseurl from "../../baseurl";
const Login = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const user = cookies.get("user");
  const SendLoginRequest = (e) => {
    e.preventDefault();
    fetch(`${baseurl}/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: cryptoJs.SHA256(password).toString(),
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.status === 200) {
          console.log(data.status);
          cookies.set("user", { email }, { path: "/" });
          navigate("/dashboard");
        } else {
          alert(data.message);
        }
      });
  };
  if (user) {
    window.location.replace("/dashboard");
  } else {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-12 text-start mt-4">
            <form>
              <label>Email</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              <label>Password</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              <button
                className="btn btn-primary mt-3"
                onClick={SendLoginRequest}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
};
export default Login;
