import { useState } from "react";
import { useNavigate, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signUpUser } from '../../features/userSlice';

//Styles
import "./SignUp.css";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    dispatch(signUpUser({ email, password, name, age }))
      .then((action) => {
        if (signUpUser.fulfilled.match(action)) {
          localStorage.setItem('user', JSON.stringify(action.payload));
          navigate('/');
        }
        if (signUpUser.rejected.match(action)) {
          console.log(action.payload); // Error message
        }
      });
  };

  return (
    <main>
      <section className="form-section">
        <div className="form-section__container">
          <h1>Sign up</h1>
          <form className="form-section__form">
            <div className="form-section__input-container">
              <label htmlFor="user-name">
                <input
                  type="text"
                  id="user-name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <span>Name</span>
              </label>
            </div>
            <div className="form-section__input-container">
              <label htmlFor="user-email">
                <input
                  type="email"
                  id="user-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email address"
                />
                <span>Email</span>
              </label>
            </div>
            <div className="form-section__input-container">
              <label htmlFor="user-age">
                <input
                  type="text"
                  id="user-age"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
                <span>Age</span>
              </label>
            </div>
            <div className="form-section__input-container">
              <label htmlFor="user-password">
                <input
                  type="password"
                  id="user-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create password"
                />
                <span>Password</span>
              </label>
            </div>

            <button type="submit" onClick={onSubmit}>
              GO
            </button>
          </form>

          <p className="form-section__bottom-text">
            Already have an account? <NavLink to="/login">Click here</NavLink>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Signup;
