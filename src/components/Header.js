import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <header className="header">
      <Link className="logo" to="/">
        <img src="/logo512.png" alt="logo" />
      </Link>
      <div className="header__links">
        <Link className="profileBtn" to="/profile">
          <img src="/profile.png" alt="profile-icon" />
        </Link>
        <button className="logoutBtn" onClick={handleLogout}>
          <img src="/logout.png" alt="logout-icon" />
        </button>
      </div>
    </header>
  );
}

export default Header;
