import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginUser } from '../../features/userSlice';
//Styles
import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .then((action) => {
        if (loginUser.fulfilled.match(action)) {
          localStorage.setItem('user', JSON.stringify(action.payload));
          navigate('/');
        }
        if (loginUser.rejected.match(action)) {
          console.log(action.payload); // Error message
        }
      });
  };

  return (
    <>
      <section className="form-section">
        <div className="form-section__container">
          <h1>Login</h1>
          <form>
            <div className="form-section__input-container">
              <label htmlFor="user-email">
                <input
                  id="user-email"
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span>Email</span>
              </label>
            </div>

            <div className="form-section__input-container">
              <label htmlFor="user-password">
                <input
                  id="user-password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span>Password</span>
              </label>
            </div>

            <button onClick={onLogin}>Login</button>
          </form>

          <p className="form-section__bottom-text">
            No account yet? <NavLink to="/signup">Sign up</NavLink>
          </p>
        </div>
      </section>
    </>
  );
};

export default Login;
