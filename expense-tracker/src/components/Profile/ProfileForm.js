import { useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Store/AuthContext";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const fullNameInputRef = useRef();
  const profileUrlInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyAl2_-4qrH9gTXCHoxpWVKvUtpgfgrcVTo",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: authCtx.token,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const userData = data.users[0];
        fullNameInputRef.current.value = userData.displayName || "";
        profileUrlInputRef.current.value = userData.photoUrl || "";
      })
      .catch((error) => {
        console.log(error);
      });
  }, [authCtx.token]);

  const cancelHandler = () => {
    navigate("/");
  };

  const updateProfile = (event) => {
    event.preventDefault();

    const enteredName = fullNameInputRef.current.value;
    const enteredPhotoURL = profileUrlInputRef.current.value;

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAl2_-4qrH9gTXCHoxpWVKvUtpgfgrcVTo",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: authCtx.token,
          displayName: enteredName,
          photoUrl: enteredPhotoURL,
          returnSecureToken: true,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Profile updated:", data);
        localStorage.setItem("profileCompleted", "true");
        navigate("/");
      })
      .catch((error) => {
        console.error("Profile update failed:", error);
      });

    fullNameInputRef.current.value = "";
    profileUrlInputRef.current.value = "";
  };

  return (
    <div>
      <form className={classes.form}>
        <div className={classes.control}>
          <label htmlFor="full-name">Full Name</label>
          <input type="text" id="full-name" ref={fullNameInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="photo-url">Profile Photo URL</label>
          <input
            type="text"
            id="photo-url"
            ref={profileUrlInputRef}
            required
          />
        </div>
        <div className={classes.action}>
          <button onClick={updateProfile} className={classes.update}>
            Update
          </button>
        </div>
      </form>
      <button onClick={cancelHandler} className={classes.cancel}>
        Cancel
      </button>
    </div>
  );
};

export default ProfileForm;
