import React, { useState } from 'react';
import './Form.css';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="container">
      {isSignUp ? (
        <>
          <h1 className="form-title">Register To Explore Carting Express Today!</h1>
          <form method="post" action="">
            <div id="signUpMessage" className="messageDiv" style={{ display: 'none' }}></div>
            <div className="input-group">
              <i className="fas fa-user"></i>
              <input type="text" id="fName" placeholder="First Name" required />
              <label htmlFor="fName">First Name</label>
            </div>
            <div className="input-group">
              <i className="fas fa-user"></i>
              <input type="text" id="lName" placeholder="Last Name" required />
              <label htmlFor="lName">Last Name</label>
            </div>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input type="email" id="rEmail" placeholder="Email" required />
              <label htmlFor="rEmail">Email</label>
            </div>
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input type="password" id="rPassword" placeholder="Password" required />
              <label htmlFor="rPassword">Password</label>
            </div>
            <button className="btn" id="submitSignUp">Sign Up</button>
          </form>
          <p className="or">----------or--------</p>
          <div className="icons">
            <i className="fab fa-google"></i>
            <i className="fab fa-facebook"></i>
          </div>
          <div className="links">
            <p>Already Have Account?</p>
            <button id="signInButton" onClick={toggleAuthMode}>Sign In</button>
          </div>
        </>
      ) : (
        <>
          <h1 className="form-title">Sign In and Explore Carting Express</h1>
          <form method="post" action="">
            <div id="signInMessage" className="messageDiv" style={{ display: 'none' }}></div>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input type="email" id="email" placeholder="Email" required />
              <label htmlFor="email">Email</label>
            </div>
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input type="password" id="password" placeholder="Password" required />
              <label htmlFor="password">Password</label>
            </div>
            <p className="recover">
              <a href="#">Recover Password</a>
            </p>
            <button className="btn" id="submitSignIn">Sign In</button>
          </form>
          <p className="or">----------or--------</p>
          <div className="icons">
            <i className="fab fa-google"></i>
            <i className="fab fa-facebook"></i>
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
