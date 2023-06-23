import React, { useState } from 'react';
import { attemptLogin } from '../store';
import { useDispatch } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CreateUser2 from './CreateUser2';

const Login2 = () => {
  const dispatch = useDispatch();

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

 

  const onChange = (ev) => {
    setCredentials({ ...credentials, [ev.target.name]: ev.target.value });
  };

  const login = (ev) => {
    ev.preventDefault();
    dispatch(attemptLogin(credentials));
  };

  return (
    
      <Grid container component="main" sx={{ height: '100vh' }}>
       
        <Grid
          item
          xs={false}
          sm={7}
          sx={{
            backgroundImage:
              'url(https://cdn.dribbble.com/users/117018/screenshots/5891038/media/10b027f834b73ce11c0f142ffcb37bcf.jpg?compress=1&resize=1200x900&vertical=top)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'left',
          }}
        />
        <Grid item xs={12} sm={5} component={Paper} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              color="secondary"
              component="img"
              width="100px"
              height="100px"
              src="https://cdn-icons-png.flaticon.com/512/2553/2553691.png"
            ></Box>
            <br />
            
            <Typography
              component="h1"
              variant="h4"
              sx={{
                
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'black',
                textDecoration: 'none',
              }}
            >
              <b>SNACKLUB</b>
            </Typography>
            <br />
            <br />
            <Avatar sx={{ mr: 1, bgcolor: 'primary' }}>
              <LockOutlinedIcon />
            </Avatar>
            <br />
            <Typography sx={{ mr: 1}}component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={login} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="user"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={credentials.username}
                onChange={onChange}
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
                value={credentials.password}
                onChange={onChange}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
            <Box style={{display:"flex", direction:"row", alignItems:"center"}}>
              <Grid>
              <Typography>Don't have an account yet?</Typography>
              </Grid>
              <Grid>
              <CreateUser2 />
              </Grid>
            </Box>
          </Box>
          
        </Grid>
        
      </Grid>
    
  );
};

export default Login2;
