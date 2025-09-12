import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../redux/slices/themeSlice';
import './NotFound.css';
// import heroImg from "../../assets/Horses_in_Moonlight.png";

const NotFound = () => {
  const darkMode = useSelector(selectDarkMode);

  return (
    <div className={`notfound-page${darkMode ? ' dark-mode' : ''}`}>
      <div className="notfound-content">
        <img
          src="https://media.giphy.com/media/l2JehQ2GitHGdVG9y/giphy.gif"
          alt="404 Not Found"
          className="notfound-img"
        />
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="notfound-home-btn">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;