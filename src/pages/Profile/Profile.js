import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updatePassword, updateEmail } from "firebase/auth";
import { db, auth, storage } from "../../firebase";

// Components
import Header from "../../components/Header";
import Preloader from "../../components/Preloader";
import EditIcon from "../../icons/editIcon";

//Styles
import "./Profile.css";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [editStatus, setEditStatus] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user profile page access = true");
      } else {
        navigate("/login");
      }
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.name || "");
        setEmail(userData.email || "");
        setPassword(userData.password || "");
        setAge(userData.age || "");
        setImageFile(userData.profileImage || "/user.png");
      } else {
        console.log("User not found");
      }
    };

    fetchData();
  }, [formSubmitted]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name: name,
        age: age,
      });

      updateEmail(user, email)
        .then(() => {
          updateDoc(userRef, {
            email: email,
          });
        })
        .catch((error) => {
          console.log(error);
        });

      updatePassword(user, password)
        .then(() => {
          updateDoc(userRef, {
            password: password,
          });
        })
        .catch((error) => {
          console.log(error);
        });

      if (imageFile) {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, imageFile);

        // Update user document with the new image URL
        const downloadURL = await getDownloadURL(storageRef);
        await updateDoc(userRef, {
          profileImage: downloadURL,
        });
      }

      setFormSubmitted(!formSubmitted);
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  return (
    <>
      <Header />
      <Preloader />
      <section className="profile-section">
        <form className="user-form" onSubmit={handleSubmit}>
          <div className="profile-image">
            <div
              className="profile-image-edit"
              onClick={() => setEditStatus(!editStatus)}
            >
              <EditIcon />
            </div>
            {editStatus ? (
              <input
                type="file"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            ) : (
              <img src={imageFile} alt="test" />
            )}
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="text"
            placeholder="Password"
          />
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            type="text"
            placeholder="Age"
          />
          <button type="submit">Edit</button>
        </form>
      </section>
    </>
  );
};

export default Profile;
