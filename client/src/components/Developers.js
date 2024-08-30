import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Card, CardContent, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person'; // Example icon for person

const Developers = () => {
  const [developers, setDevelopers] = useState([]);
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    setDevelopers([
      { id: 1, name: 'Margaret'},
      { id: 2, name: 'Kiki'},
      { id: 3, name: 'Cary'},
      { id: 4, name: 'Robben'}
    ]);
    setInstructors([
      { id: 1, name: 'Leon'},
      { id: 2, name: 'Thomas'}
    ]);
  }, []);

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'center', minHeight: '100vh' }}>
      <Box sx={{ width: '100%', maxWidth: 600, bgcolor: '#ffffff', p: 3, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Typography variant="h4" sx={{ mb: 4, color: '#1976d2', fontWeight: 'medium' }}>Developers</Typography>
        <List sx={{ mb: 4 }}>
          {developers.map((developer) => (
            <ListItem key={developer.id} sx={{ mb: 1, padding: 0 }}>
              <Card variant="outlined" sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 6
                }
              }}>
                <Avatar sx={{ m: 2, bgcolor: 'secondary.main' }}>
                  <PersonIcon />
                </Avatar>
                <CardContent>
                  <ListItemText primary={developer.name} primaryTypographyProps={{ variant: 'h6' }} />
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
        <Typography variant="h5" sx={{ mt: 4, mb: 2, color: '#1976d2', fontWeight: 'medium' }}>Instructors</Typography>
        {instructors.map((instructor) => (
          <Card key={instructor.id} variant="outlined" sx={{
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#fff',
            p: 2,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'scale(1.03)',
              boxShadow: 6
            }
          }}>
            <Avatar sx={{ m: 2, bgcolor: 'primary.main' }}>
              <PersonIcon />
            </Avatar>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{instructor.name}</Typography>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Developers;
