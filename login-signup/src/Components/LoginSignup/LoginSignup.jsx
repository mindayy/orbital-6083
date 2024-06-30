import React, { useState } from 'react';
import './LoginSignup.css';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

import user_icon from '../Assets/user (1).png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/padlock.png'

const LoginSignup = () => {

    const [action, setAction] = useState("Sign Up");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');
    const [message, setMessage] = useState('');

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userData = {
                email,
                userId,
            };
            await setDoc(doc(db, 'users', user.uid), userData);
            setMessage('Account Created Successfully');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setMessage('Email Address Already Exists.');
            } else {
                setMessage('Unable to create User');
            }
        }
    };

    const handleSignIn = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setMessage('Login is successful');
            localStorage.setItem('loggedInUserId', userCredential.user.uid);
            window.location.href = 'homepage.html'; // Update this to your desired route
        } catch (error) {
            if (error.code === 'auth/invalid-credential') {
                setMessage('Incorrect Email or Password');
            } else {
                setMessage('Account does not Exist');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (action === "Sign Up") {
            handleSignUp();
        } else {
            handleSignIn();
        }
    };

    return (
        <div className='container'>
            <div className='header'>
                <div className='text'>{action}</div>
                <div className='underline'></div>
            </div>
            <div className='inputs'>
                {action==="Login"?<div></div>:
                <div className='input'>
                    <img src={user_icon} alt='' />
                    <input 
                        type='text' 
                        placeholder='User ID' 
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </div>}

                <div className='input'>
                    <img src={email_icon} alt='' />
                    <input 
                        type='email' 
                        placeholder='Email Address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className='input'> 
                    <img src={password_icon} alt='' />
                    <input 
                        type='password' 
                        placeholder='Password' 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>
            {action==="Sign Up"?<div></div>:
            <div className='forgot-password'>Forgot Password? <span> Click Here.</span></div>
            }
            <div className='submit-container'>
                <div 
                    className={action==="Login"?"submit gray":"submit"} 
                    onClick={()=> {
                        setAction("Sign Up");
                        setMessage(''); 
                    }} > Sign Up
                
                </div>
                <div className={action==="Sign Up"?"submit gray":"submit"} 
                onClick={()=>{
                    setAction("Login");
                    setMessage('');
                }}>Login</div>
                <button onClick={handleSubmit} className="submit">{action}</button>
            </div>
        </div>
    )
}

export default LoginSignup