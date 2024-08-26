import React from 'react';
import { AppBar, Toolbar, Typography, Button, TextField, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Header = ({ darkMode, toggleDarkMode }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const returnHomeClick = () => {
    alert('You are in the homepage now');
  };

  const toPortfolio = () => {
    alert('You are in the Portfolio page now');
  };

  const newFeatures = () => {
    alert('New features are coming soon');
  };

  const logIn = () => {
    alert('Log in page is coming soon');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: darkMode ? 'grey.900' : 'white' }}>
      <Toolbar>
        <Button
          onClick={returnHomeClick}
          sx={{
            textTransform: 'none',
            color: darkMode ? 'white' : 'black',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          <Typography variant="h6" component="div">
            Homepage
          </Typography>
        </Button>
        <Box sx={{ mx: 5, display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <TextField
            label="Search"
            placeholder="Scan stocks, ETF & more information here"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                handleSearch();
              }
            }}
            sx={{
              width: '500px',
              bgcolor: darkMode ? 'grey.800' : 'background.paper',
              '& .MuiOutlinedInput-root': {
                color: darkMode ? 'white' : 'black',
                '&.Mui-focused fieldset': {
                  borderColor: 'secondary.main',
                },
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? 'grey.400' : 'grey.700',
              },
            }}
          />
          <Button color="inherit" onClick={handleSearch} sx={{ color: 'secondary.light', ml: 1 }}>
            <SearchIcon />
          </Button>
          <Button color="inherit" onClick={toPortfolio} sx={{ color: 'secondary.light', ml: 5 }}>
            Portfolio
          </Button>
          <Button color="inherit" onClick={newFeatures} sx={{ color: 'secondary.light', ml: 2 }}>
            Other features
          </Button>
        </Box>
        <IconButton onClick={toggleDarkMode} color="inherit" sx={{ color: darkMode ? 'white' : 'black' }}>
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Button color="inherit" onClick={logIn} sx={{ color: 'secondary.light', ml: 1 }}>
          Log In
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
