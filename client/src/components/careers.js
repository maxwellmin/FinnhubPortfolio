import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';

const Careers = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Simulate fetching job listings from an API or static data
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
      <Typography variant="h4" sx={{ mb: 2 }}>Careers</Typography>
      <List>
        {jobs.map((job) => (
          <ListItem key={job.id}>
            <ListItemText primary={job.title} secondary={`Location: ${job.location}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Careers;
