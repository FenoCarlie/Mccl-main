import { link } from "react-router-dom";
import { usestatecontext } from "../context/contextprovider.jsx";
import { usestate } from "react";
import axios from "axios";

export default function login() {
  const { setuser, settoken } = usestatecontext();
  const [message, setmessage] = usestate(null);
  const [regnumber, setregnumber] = usestate("");
  const [password, setpassword] = usestate("");

  const onsubmit = (ev) => {
    ev.preventdefault();

    const payload = {
      reg_number: regnumber,
      password: password,
    };

    axios
      .post("http://localhost:8081/login", payload)
      .then(({ data }) => {
        setuser(data.user);
        settoken(data.token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setmessage(response.data.message);
        }
      });
  };

  return (
    <div classname="login-signup-form animated fadeindown">
      <div classname="form">
        <form onsubmit={onsubmit}>
          <h1 classname="title">login into your account</h1>

          {message && (
            <div classname="alert">
              <p>{message}</p>
            </div>
          )}

          <input
            type="text"
            placeholder="reg number"
            value={regnumber}
            onchange={(e) => setregnumber(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onchange={(e) => setpassword(e.target.value)}
          />

          <button classname="btn btn-block">login</button>
          <p classname="message">
            not registered <link to="/signup">create an account</link>
          </p>
        </form>
      </div>
    </div>
  );
}
