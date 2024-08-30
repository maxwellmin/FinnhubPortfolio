import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, List, ListItem, Typography, useTheme } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work'; // Icon for jobs
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Icon for location

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const theme = useTheme(); // Access theme for consistent styling

  useEffect(() => {
    setJobs([
      { id: 1, title: 'Software Engineer', location: 'Remote' },
      { id: 2, title: 'Data Scientist', location: 'New York, NY' },
      { id: 3, title: 'Product Manager', location: 'San Francisco, CA' },
      { id: 4, title: 'UX/UI Designer', location: 'Remote' },
      { id: 5, title: 'DevOps Engineer', location: 'Austin, TX' },
      { id: 6, title: 'HR Specialist', location: 'Remote' },
      { id: 7, title: 'Marketing Director', location: 'Chicago, IL' }
    ]);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Current Openings</Typography>
      <List>
        {jobs.map((job) => (
          <ListItem key={job.id} sx={{ mb: 2 }}>
            <Card 
              elevation={3} 
              sx={{ 
                width: '100%', 
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: theme.shadows[10] // Elevated shadow effect on hover
                }
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <WorkIcon color="primary" />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {job.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.text.secondary }}>
                    <LocationOnIcon fontSize="small" />
                    <Typography variant="body2">{job.location}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Careers;
