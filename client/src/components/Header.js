import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Button, TextField, Box, IconButton, List, ListItem, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import axios from 'axios';

const Header = ({ darkMode, toggleDarkMode }) => {
  const header = "http://localhost:3000";
  const [searchQuery, setSearchQuery] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const navigate = useNavigate();  // Create a navigate function
  // const searchBarRef = useRef(null);
  // const suggestionBoxRef = useRef(null);

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      try {
        const response = await axios.get(`${header}/fin/searchutil/${encodeURIComponent(query)}`);
        setSuggestions(response.data);  // Assuming the API returns an array of suggestions
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);  // Clear suggestions if query is empty
    }
  };

  const handleSuggestionClick = (ticker) => {
    navigate(`/stock/${encodeURIComponent(ticker)}`);
    setSearchQuery('');  // Clear the search box
    setSuggestions([]);  // Clear the suggestions
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    if (searchQuery.trim()) {  // Check if searchQuery is not just whitespace
      navigate(`/stock/${encodeURIComponent(searchQuery)}`);  // Navigate to the stock page
    }
  };

  // const handleClickOutside = (event) => {
  //   if (
  //     searchBarRef.current &&
  //     !searchBarRef.current.contains(event.target) &&
  //     suggestionBoxRef.current &&
  //     !suggestionBoxRef.current.contains(event.target)
  //   ) {
  //     setSuggestions([]);
  //   }
  // };


  const returnHomeClick = () => {
    navigate('/');  // Use navigate to go to the homepage
  };

  const toPortfolio = () => {
    navigate('/portfolio');  // Navigate to the Portfolio page
  };

  const toHistory = () => {
    navigate('/history');  // Navigate to the Portfolio page
  };

  const newFeatures = () => {
    alert('$20 per month for plus version!');  // Show an alert
  };

  const login = () => {
    navigate('/login');
  };

  // useEffect(() => {
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

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
        <Button color="inherit" onClick={newFeatures} sx={{ color: 'secondary.light', ml: 2 }}>
          Other features
        </Button>
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
