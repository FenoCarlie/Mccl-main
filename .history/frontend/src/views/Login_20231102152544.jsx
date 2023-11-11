import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({ regNumber: "", password: "" });
  const [error, setError] = useState(null);

  const onSubmit = (ev) => {
    ev.preventDefault();

    const payload = {
      reg_number: formData.regNumber,
      password: formData.password,
    };

    axios
      .post("http://localhost:8081/login", payload)
      .then(({ data }) => {
        setError(null);
        // Réinitialisez les champs après une connexion réussie
        setFormData({ regNumber: "", password: "" });
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setError(response.data.message);
        } else {
          setError("Une erreur s'est produite lors de la connexion.");
        }
      });
  };

  return (
    <div className="login-signup-form animated fadeindown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Login into your account</h1>

          {error && (
            <div className="alert">
              <p>{error}</p>
            </div>
          )}

          <input
            type="text"
            placeholder="reg number"
            value={formData.regNumber}
            onChange={(e) =>
              setFormData({ ...formData, regNumber: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
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
