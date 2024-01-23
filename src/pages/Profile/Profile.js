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
  const [imagePreview, setImagePreview] = useState(null);

  const [emailChanged, setEmailChanged] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const [editStatus, setEditStatus] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!age) newErrors.age = "Age is required";
    return newErrors;
  };

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

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.name || "");
        setEmail(userData.email || "");
        setPassword(userData.password || "");
        setAge(userData.age || "");
        setImagePreview(userData.profileImage || "/user.png");
      } else {
        console.log("User not found");
      }
    };

    fetchData();
  }, [formSubmitted]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name: name,
        age: age,
      });

      if (emailChanged) {
        updateEmail(user, email)
          .then(() => {
            updateDoc(userRef, {
              email: email,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }

      if (passwordChanged) {
        updatePassword(user, password)
          .then(() => {
            updateDoc(userRef, {
              password: password,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }

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

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
      setEditStatus(false);
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
              <input type="file" onChange={handleImageChange} />
            ) : (
              <img src={imagePreview} alt="test" />
            )}
          </div>
          <div className="field-row">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>
          <div className="field-row">
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailChanged(true);
              }}
              type="text"
              placeholder="Email"
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div className="field-row">
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordChanged(true);
              }}
              type="text"
              placeholder="Password"
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <div className="field-row">
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              type="text"
              placeholder="Age"
            />
            {errors.age && <p className="error">{errors.age}</p>}
          </div>
          <button type="submit">Edit</button>
        </form>
      </section>
    </>
  );
};

export default Profile;
