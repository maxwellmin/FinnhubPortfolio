import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const Developers = () => {
  const [developers, setDevelopers] = useState([]);

  useEffect(() => {
    // Simulate fetching developer information from an API or static data
    setDevelopers([
      { id: 1, name: 'M', role: 'Full Stack God1', experience: '1 years' },
      { id: 2, name: 'C', role: 'Full Stack God2', experience: '2 years' },
      { id: 3, name: 'K', role: 'Full Stack God3', experience: '3 years' },
      { id: 4, name: 'R', role: 'Full Stack God4', experience: '4 years' }
    ]);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Developers</Typography>
      <List>
        {developers.map((developer) => (
          <ListItem key={developer.id}>
            <ListItemText 
              primary={developer.name}
              secondary={`${developer.role} - ${developer.experience} experience`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Developers;
