import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../firebaseConfig';
import { useUser } from '../UserContext/UserContext';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import './Auth.css';

const Auth = () => {
  const { login } = useUser();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const db = getFirestore();

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setMessage("");
    setError("");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), { email: user.email, firstName: fName, lastName: lName });
      setMessage("Successfully Registered");
      setTimeout(() => {
        setIsSignUp(false);
        setMessage("");
        navigate("/auth");
      }, 2000);
    } catch (error) {
      setError("Error signing up: " + error.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await login(user.email); // Call login function
      setMessage("Successfully Signed In");
      navigate("/profile");
    } catch (error) {
      setError("Error signing in: " + error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await login(user.email); // Call login function
      setMessage("Successfully Signed In");
      navigate("/profile");
    } catch (error) {
      setError("Error signing in with Google: " + error.message);
    }
  };

  return (
    <div className="container">
      {message && <div className="messageDiv">{message}</div>}
      {error && <div className="messageDiv">{error}</div>}
      {isSignUp ? (
        <>
          <h1 className="form-title">Register</h1>
          <form onSubmit={handleSignUp}>
            <div className="input-group">
              <i className="fas fa-user"></i>
              <input type="text" id="fName" placeholder="First Name" required value={fName} onChange={(e) => setFName(e.target.value)} />
              <label htmlFor="fName">First Name</label>
            </div>
            <div className="input-group">
              <i className="fas fa-user"></i>
              <input type="text" id="lName" placeholder="Last Name" required value={lName} onChange={(e) => setLName(e.target.value)} />
              <label htmlFor="lName">Last Name</label>
            </div>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input type="email" id="rEmail" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <label htmlFor="rEmail">Email</label>
            </div>
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input type="password" id="rPassword" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <label htmlFor="rPassword">Password</label>
            </div>
            <button className="btn" id="submitSignUp" type="submit">Sign Up</button>
          </form>
          <p className="or">----------or--------</p>
          <div className="icons">
            <i className="fab fa-google" onClick={handleGoogleSignIn}></i>
          </div>
          <div className="links">
            <p>Already Have Account?</p>
            <button id="signInButton" onClick={toggleAuthMode}>Sign In</button>
          </div>
        </>
      ) : (
        <>
          <h1 className="form-title">Sign In</h1>
          <form onSubmit={handleSignIn}>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input type="email" id="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <label htmlFor="email">Email</label>
            </div>
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input type="password" id="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <label htmlFor="password">Password</label>
            </div>

            <button className="btn" id="submitSignIn" type="submit">Sign In</button>
          </form>
          <p className="or">----------or--------</p>
          <div className="icons">
            <i className="fab fa-google" onClick={handleGoogleSignIn}></i>
          </div>
          <div className="links">
            <p>Don't have account yet?</p>
            <button id="signUpButton" onClick={toggleAuthMode}>Sign Up</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Auth;
