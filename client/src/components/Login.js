import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState(['exampleUser']); // Simulated user database
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent form from submitting
    if (registeredUsers.includes(username)) {
      console.log('Attempting to log in with:', username, password);
      alert('Welcome back!');
      navigate('/'); // Redirect to a dashboard or home page on successful login
    } else {
      alert('Please register first');
    }
  };

  const handleRegister = () => {
    if (!registeredUsers.includes(username)) {
      setRegisteredUsers(prevUsers => [...prevUsers, username]); // Add new user to "database"
      alert('Hello New face! Welcome to our APP');
      navigate('/'); // Redirect after registration
    } else {
      alert('This username is already taken, please choose another one or log in.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
        <Typography component="h1" variant="h5">
          Sign In 
        </Typography>
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 , bgcolor:'#EE3524', '&:hover': {bgcolor:'#EE3524'}}}
            onClick={handleLogin}
          >
            Log In
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 1, mb: 2, color:'#EE3524' ,borderColor: '#EE3524',
              '&:hover': {
                borderColor: '#EE3524',
                backgroundColor: 'rgba(238, 53, 36, 0.08)',
              },}}
            onClick={handleRegister}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
