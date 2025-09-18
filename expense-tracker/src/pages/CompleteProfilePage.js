import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../Store/auth-slice";

const CompleteProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId); // Firebase UID
  const email = useSelector((state) => state.auth.email);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://expense-tracker-3817d-default-rtdb.firebaseio.com/users/${userId}.json?auth=${token}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name,
            email,
            mobile,
            profileCompleted: true,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Saving profile failed");

      dispatch(authActions.setProfileCompleted(true));
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        required
      />
      <button type="submit">Save Profile</button>
    </form>
  );
};

export default CompleteProfilePage;
