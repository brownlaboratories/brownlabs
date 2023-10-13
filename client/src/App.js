import './App.css';
import { AuthProvider } from './AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Onboarding/Register';
import { Box } from '@mui/material';
import Home from './components/Home/Home';
import {LoginForm} from './components/Root/Login';
import Navbar from './components/Root/Navbar';
import GetStarted from './components/Onboarding/GetStarted';
import AddCourse from './components/Admin/AddCourse';
import Study from './components/Study';
import Account from './components/Account';
import Catalog from './components/Root/Catalog';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Box sx={{ display: 'flex', flexDirection: "column", height: '100vh' }}>
          <Navbar />
          <Box flex="1" display="flex" justifyContent="center" alignItems="center" height="92vh" width="100vw">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/account" element={<Account />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/admin/add-course" element={<AddCourse />} />
            <Route path="/study">
              <Route index={true} element={<Home />} />
              <Route path=":id" element={<Study />} />
            </Route>
          </Routes>
          </Box>
        </Box>
      </Router>


    </AuthProvider>
  );
}

export default App;
