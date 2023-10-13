import { Typography } from "@mui/material";
import {LoginForm} from "./Login";

import React, { useState, useEffect, useContext } from 'react';
import {useNavigate} from 'react-router-dom';

const PleaseLogin = () => {
    return (
        <Container maxWidth="sm">
            <Typography align="center" variant="h1">Login to access this page</Typography>
            <LoginForm />
        </Container>
    );
}

export default PleaseLogin;