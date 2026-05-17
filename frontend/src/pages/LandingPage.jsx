import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Hero Section */}
            <Box sx={{
                pt: 15,
                pb: 10,
                px: 2,
                textAlign: 'center',
                background: 'linear-gradient(180deg, rgba(243,244,246,0) 0%, rgba(99,102,241,0.05) 100%)'
            }}>
                <Container maxWidth="md">
                    <Typography component="h1" variant="h2" sx={{ mb: 3, background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)', backgroundClip: 'text', textFillColor: 'transparent', color: 'transparent' }}>
                        Build Your Dream Resume in Minutes
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 5, lineHeight: 1.6 }}>
                        Professional, responsive, and beautiful templates tailored for your success.
                        Join thousands of job seekers getting hired today.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/register')}
                        sx={{ fontSize: '1.2rem', px: 5, py: 1.5 }}
                    >
                        Get Started for Free
                    </Button>
                </Container>
            </Box>

            {/* Features Section */}
            <Container sx={{ py: 10 }}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper elevation={0} sx={{ p: 4, height: '100%', bgcolor: 'background.default', textAlign: 'center' }}>
                            <AutoFixHighIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                            <Typography variant="h5" gutterBottom fontWeight="bold">AI Powered</Typography>
                            <Typography color="text.secondary">
                                Smart suggestions to help you write better content and stand out.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper elevation={0} sx={{ p: 4, height: '100%', bgcolor: 'background.default', textAlign: 'center' }}>
                            <SpeedIcon color="secondary" sx={{ fontSize: 50, mb: 2 }} />
                            <Typography variant="h5" gutterBottom fontWeight="bold">Fast & Easy</Typography>
                            <Typography color="text.secondary">
                                Create a professional resume in under 15 minutes with our intuitive builder.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper elevation={0} sx={{ p: 4, height: '100%', bgcolor: 'background.default', textAlign: 'center' }}>
                            <SecurityIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                            <Typography variant="h5" gutterBottom fontWeight="bold">Secure & Private</Typography>
                            <Typography color="text.secondary">
                                Your data is yours. We use bank-level encryption to keep your information safe.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Footer */}
            <Box sx={{ py: 4, textAlign: 'center', bgcolor: 'grey.100', mt: 'auto' }}>
                <Typography variant="body2" color="text.secondary">
                    © 2025 Resume API. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
};

export default LandingPage;
