import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Box,
    CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { transformToFrontend } from '../utils/resumeMapper';
import ResumeCard from '../components/ResumeCard';
import PageHeader from '../components/PageHeader';
import { TEMPLATE_IDS } from '../components/LivePreview';

const ResumeListPage = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            setError(null);
            const response = await authService.getUserResumes();
            setResumes(response.data);
        } catch (error) {
            console.error("Failed to fetch resumes", error);
            setError("Failed to load resumes. Please try refreshing the page.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this resume?")) {
            try {
                await authService.deleteResume(id);
                fetchResumes();
            } catch (error) {
                console.error("Failed to delete resume", error);
            }
        }
    };

    const handleCreateNew = () => {
        navigate('/resumes/new');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth={false} sx={{ py: 6, px: { xs: 2, md: 6 } }}>
                <PageHeader title="My Resumes" subtitle="Manage your resumes" />
                <Typography color="error" variant="h6" align="center" sx={{ mt: 4 }}>
                    {error}
                </Typography>
                <Box textAlign="center" mt={2}>
                    <Button variant="outlined" onClick={fetchResumes}>Retry</Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth={false} sx={{ py: 6, px: { xs: 2, md: 6 } }}>
            <PageHeader
                title="My Resumes"
                subtitle="Create, edit, and manage your professional resumes."
                action={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        size="large"
                        onClick={handleCreateNew}
                        disableElevation
                        sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 'bold', textTransform: 'none', fontSize: '1rem' }}
                    >
                        Create New Resume
                    </Button>
                }
                sx={{ mb: 6 }}
            />

            {resumes.length === 0 ? (
                <EmptyState onCreate={handleCreateNew} />
            ) : (
                // EXACT GRID STRUCTURE FROM YOUR TEMPLATE LIST
                <Grid container spacing={4}>
                    {resumes.map((resume) => {
                        try {
                            const frontendData = transformToFrontend(resume);
                            const templateId = resume.template?.theme || TEMPLATE_IDS.MODERN;
                            const palette = resume.template?.colorPalette?.[0];
                            const id = resume.id || resume._id;

                            return (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={id} display="flex">
                                    <ResumeCard
                                        title={resume.title || "Untitled Resume"}
                                        updatedAt={resume.updatedAt}
                                        data={frontendData}
                                        templateId={templateId}
                                        palette={palette}
                                        onEdit={() => navigate(`/resumes/${id}`)}
                                        onDelete={(e) => handleDelete(e, id)}
                                        // Ensure card fills height like the templates do
                                        style={{ width: '100%' }}
                                    />
                                </Grid>
                            );
                        } catch (err) {
                            console.error("Error rendering resume card", err);
                            return null;
                        }
                    })}
                </Grid>
            )}
        </Container>
    );
};

const EmptyState = ({ onCreate }) => (
    <Paper
        elevation={0}
        sx={{
            p: 8, textAlign: 'center',
            bgcolor: '#f8fafc', border: '2px dashed #cbd5e1',
            borderRadius: 4, maxWidth: 600, mx: 'auto', mt: 4
        }}
    >
        <Typography variant="h5" fontWeight="bold" color="text.secondary" gutterBottom>
            No resumes yet
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
            Create your first professional resume in minutes.
        </Typography>
        <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={onCreate} sx={{ borderRadius: 8 }}>
            Create Resume
        </Button>
    </Paper>
);

export default ResumeListPage;