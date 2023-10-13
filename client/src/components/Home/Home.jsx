import React, { useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import Landing from './Landing';
import Dashboard from './Dashboard';

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  return (
    <>
      {currentUser ? <Dashboard /> : <Landing/>}
    </>
  );
};

export default Home;
