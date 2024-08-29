import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid, CircularProgress, useTheme, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import MessageIcon from '@mui/icons-material/Message';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', inquiryType: '' });
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);
    // Simulate an API call
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <Box sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: theme.palette.background.paper,
      boxShadow: theme.shadows[3],
      borderRadius: 2,
      mx: 'auto',
      maxWidth: 600
    }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'medium' }}>Contact Us</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: <PersonIcon color="action" />
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: <EmailIcon color="action" />
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            InputProps={{
              startAdornment: <MessageIcon color="action" />
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="inquiry-type-label">Inquiry Type</InputLabel>
            <Select
              labelId="inquiry-type-label"
              id="inquiry-type"
              name="inquiryType"
              value={formData.inquiryType}
              label="Inquiry Type"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="General">General Inquiry</MenuItem>
              <MenuItem value="Funding">Funding Inquiry</MenuItem>
              <MenuItem value="Support">Support</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactUs;
