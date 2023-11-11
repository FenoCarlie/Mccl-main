import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [message, setMessage] = useState(null);
  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (ev) => {
    ev.preventDefault();

    const payload = {
      reg_number: regNumber,
      password: password,
    };

    axios
      .post("http://localhost:8081/login", payload)
      .then(({ data }) => {
        setMessage(null);

        // Stocker le token dans le localStorage (à améliorer pour plus de sécurité)
        localStorage.setItem("token", data.token);

        // Rediriger l'utilisateur vers une autre page (par exemple, le tableau de bord)
        window.location.href = "/";
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setMessage(response.data.message);
        }
      });
  };

  return (
    <div className="login-signup-form animated fadeindown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Login into your account</h1>

          {message && (
            <div className="alert">
              <p>{message}</p>
            </div>
          )}

          <input
            type="text"
            placeholder="reg number"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-block">Login</button>
          <p className="message">
            Not registered? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
