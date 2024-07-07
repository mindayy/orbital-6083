import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import defaultProfilePic from '../Assets/defaultpfp.png';
import './ProfilePage.css';

const ProfilePage = () => {
  const auth = getAuth();
  const storage = getStorage();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || '');
        setBio(currentUser.bio || ''); // bio is not a standard property in Firebase, consider storing it in a database
        setPhotoURL(currentUser.photoURL || defaultProfilePic);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handlePhotoChange = (e) => {
    if (user) {
      const file = e.target.files[0];
      const storageRef = ref(storage, `profiles/${user.uid}`);
      uploadBytes(storageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          setPhotoURL(downloadURL);
          updateProfile(user, { photoURL: downloadURL }).catch((error) => console.error(error));
        });
      });
    }
  };

  const handleSaveChanges = () => {
    if (user) {
      const newDisplayName = displayName || `User${Math.floor(Math.random() * 10000)}`; // Random default username
      updateProfile(user, {
        displayName: newDisplayName,
        // bio is not a standard property in Firebase, consider storing it in a database
      }).then(() => {
        console.log('Profile updated successfully');
      }).catch((error) => {
        console.error('Error updating profile:', error);
      });
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile Page</h1>
      <div className="profile-photo">
        <img src={photoURL} alt="Profile" />
        <input type="file" onChange={handlePhotoChange} />
      </div>
      <div className="profile-details">
        <label>
          Username:
          <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </label>
        <label>
          Bio:
          <textarea value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
        </label>
        <button onClick={handleSaveChanges}>Save Changes</button>
      </div>
    </div>
  );
};

export default ProfilePage;
