import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const LogoutPage = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  return <Navigate to="/admin/login" />;
};

export default LogoutPage;
