import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Button, TextField, Box, IconButton, MenuItem, List, ListItem, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = ({ darkMode, toggleDarkMode }) => {
  const header = "http://localhost:3000";
  const [searchQuery, setSearchQuery] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      try {
        const response = await axios.get(`${header}/fin/searchutil/${encodeURIComponent(query)}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (ticker) => {
    navigate(`/stock/${encodeURIComponent(ticker)}`);
    setSearchQuery('');
    setSuggestions([]);
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    if (searchQuery.trim()) {  // Check if searchQuery is not just whitespace
      navigate(`/stock/${encodeURIComponent(searchQuery)}`);  // Navigate to the stock page
    }
    setSearchQuery(''); 
    setSuggestions([]);
  };

  const returnHomeClick = () => {
    navigate('/');
  };

  const toPortfolio = () => {
    navigate('/portfolio');
  };

  const toHistory = () => {
    navigate('/history');
  };

  const plus = () => {
    alert('$20 per month for plus version!');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const login = () => {
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

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
        <Box sx={{ mx: 5, display: 'flex', alignItems: 'center', flexGrow: 1, position: 'relative' }}>
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
          {suggestions.length > 0 && (
            <List sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              width: "500px",
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'grey.300',
              maxHeight: '80px',
              overflowY: 'auto',
              zIndex: 1,
            }}>
              {suggestions.map((suggestion, index) => (
                <ListItem button key={index} onClick={() => handleSuggestionClick(suggestion.symbol)}>
                  <ListItemText primary={suggestion.symbol}  
                    primaryTypographyProps={{
                      style: {
                        color: 'grey',    // Set the color to grey
                        fontSize: '0.8rem', // Reduce the font size (14px)
                      },
                    }}/>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
        <Button color="inherit" onClick={toPortfolio} sx={{ color: 'secondary.light', ml: 5 }}>
          Portfolio
        </Button>
        <Button color="inherit" onClick={toHistory} sx={{ color: 'secondary.light', ml: 2 }}>
          History
        </Button>
        <Button color="inherit" onClick={plus} sx={{ color: 'secondary.light', ml: 2 }}>
          Plus
        </Button>
        <Box sx={{ position: 'relative' }}>
          <Button color="inherit" onClick={toggleDropdown} sx={{ color: 'secondary.light', ml: 2 }}>
            Discover More
          </Button>
          {showDropdown && (
            <Box ref={dropdownRef} sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'grey.300',
              boxShadow: 1,
              zIndex: 1,
              width: '200px',
            }}>
              <MenuItem
                onClick={() => navigate('/about')}
                sx={{
                  color: 'secondary.light',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: darkMode ? 'white' : 'black',
                  },
                }}
              >
                About Us
              </MenuItem>
              <MenuItem
                onClick={() => navigate('/contact')}
                sx={{
                  color: 'secondary.light',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: darkMode ? 'white' : 'black',
                  },
                }}
              >
                Careers
              </MenuItem>
              <MenuItem
                onClick={() => navigate('/support')}
                sx={{
                  color: 'secondary.light',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: darkMode ? 'white' : 'black',
                  },
                }}
              >
                Funds
              </MenuItem>
            </Box>
          )}
        </Box>
        <IconButton onClick={toggleDarkMode} color="inherit" sx={{ color: darkMode ? 'white' : 'black' }}>
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Button color="inherit" onClick={login} sx={{ color: 'secondary.light', ml: 1 }}>
          Sign In
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
