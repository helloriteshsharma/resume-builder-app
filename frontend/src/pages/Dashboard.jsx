import React, { useEffect, useState } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    CardMedia,
    Chip,
    CircularProgress,
    IconButton,
    Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { authService } from '../services/api';
import ResumeCard from '../components/ResumeCard';
import { transformToFrontend } from '../utils/resumeMapper';
import { TEMPLATE_IDS } from '../components/LivePreview';

// Mock data for recommended templates
const recommendedTemplates = [
    { id: 1, name: "ATS Simple", image: "/templates/ats-modern.png", tag: "Most Popular" },
    { id: 2, name: "Executive Suite", image: "/templates/executive-suite.png", tag: "Premium" },
    { id: 3, name: "Creative Pro", image: "/templates/creative-pro.png", tag: "New" },
];

const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' } }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: `${color}15`, mr: 2.5 }}>
                {React.cloneElement(icon, { sx: { fontSize: 32, color: color } })}
            </Box>
            <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>{title}</Typography>
                <Typography variant="h4" fontWeight={800} color="text.primary">{value}</Typography>
            </Box>
        </CardContent>
    </Card>
);

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ resumes: 0, views: 124 }); // Mock stats for views
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const response = await authService.getUserResumes();
            setResumes(response.data);
            setStats(prev => ({ ...prev, resumes: response.data.length }));
        } catch (error) {
            console.error("Failed to fetch resumes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this resume?")) {
            try {
                await authService.deleteResume(id);
                fetchResumes(); // Refresh list
            } catch (error) {
                console.error("Failed to delete resume", error);
            }
        }
    };

    return (
        <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
            {!user?.emailVerified && (
                <Alert severity="warning" variant="filled" sx={{ mb: 4, borderRadius: 3 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                        Email Verification Required
                    </Typography>
                    Your email address is not verified. You will not be able to create or save resumes until you verify your email.
                </Alert>
            )}

            {/* Hero Section */}
            <Paper
                sx={{
                    p: { xs: 4, md: 6 },
                    mb: 5,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    color: 'white',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 30px -10px rgba(79, 70, 229, 0.4)'
                }}
                elevation={0}
            >
                <Box sx={{ maxWidth: 700 }}>
                    <Typography variant="h3" fontWeight={800} sx={{ mb: 2, lineHeight: 1.2 }}>
                        Start Your Career Journey, {user?.name?.split(' ')[0]}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
                        Create professional resumes in minutes with our AI-powered builder.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/resumes/new')}
                        startIcon={<AddIcon />}
                        sx={{
                            bgcolor: 'white',
                            color: '#4f46e5',
                            fontWeight: 'bold',
                            px: 5,
                            py: 1.5,
                            borderRadius: 3,
                            fontSize: '1.1rem',
                            ':hover': { bgcolor: '#f8fafc' }
                        }}
                    >
                        Create Resume
                    </Button>
                </Box>
            </Paper>

            {/* Stats Row */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3, ml: 1 }}>Overview</Typography>
            <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard title="Total Resumes" value={stats.resumes} icon={<DescriptionIcon />} color="#3b82f6" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard title="Profile Views" value={stats.views} icon={<TrendingUpIcon />} color="#10b981" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard title="Subscription Plan" value={user?.subscriptionPlan === 'premium' ? 'Pro' : 'Free'} icon={<AutoAwesomeIcon />} color="#f59e0b" />
                </Grid>
            </Grid>

            {/* My Resumes Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ ml: 1 }}>My Resumes</Typography>
                {resumes.length > 0 && (
                    <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate('/resumes')}>View All</Button>
                )}
            </Box>

            {
                loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : resumes.length === 0 ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4, textAlign: 'center',
                            bgcolor: '#f8fafc', border: '1px dashed #cbd5e1',
                            borderRadius: 4, mb: 5
                        }}
                    >
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            You haven't created any resumes yet.
                        </Typography>
                        <Button variant="outlined" startIcon={<AddIcon />} onClick={() => navigate('/resumes/new')} sx={{ mt: 1 }}>
                            Create Your First Resume
                        </Button>
                    </Paper>
                ) : (
                    <Grid container spacing={3} sx={{ mb: 5 }}>
                        {resumes.map((resume) => {
                            const frontendData = transformToFrontend(resume);
                            const templateId = resume.template?.theme || TEMPLATE_IDS.MODERN;
                            const palette = resume.template?.colorPalette?.[0];
                            const id = resume.id || resume._id;

                            return (
                                <Grid size={{ xs: 12, md: 6, lg: 6 }} key={id}>
                                    <ResumeCard
                                        title={resume.title || "Untitled Resume"}
                                        updatedAt={resume.updatedAt}
                                        data={frontendData}
                                        templateId={templateId}
                                        palette={palette}
                                        onEdit={() => navigate(`/resumes/${id}`)}
                                        onDelete={(e) => handleDelete(e, id)}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                )
            }

            {/* Recommended Templates */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ ml: 1 }}>Popular Templates</Typography>
                <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate('/templates')}>View All</Button>
            </Box>

            <Grid container spacing={3}>
                {recommendedTemplates.map((template) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template.id}>
                        <Card sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            boxShadow: 'none',
                            border: '1px solid #e2e8f0',
                            transition: '0.3s',
                            '&:hover': { translateY: '-5px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }
                        }}>
                            <Box sx={{ position: 'relative' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={template.image}
                                    alt={template.name}
                                    sx={{ objectFit: 'cover', objectPosition: 'top' }}
                                />
                                <Chip
                                    label={template.tag}
                                    size="small"
                                    color={template.tag === 'Premium' ? 'secondary' : 'default'}
                                    sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 600, backdropFilter: 'blur(4px)' }}
                                />
                            </Box>
                            <CardContent sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle1" fontWeight={700}>{template.name}</Typography>
                                <IconButton size="small" color="primary" onClick={() => navigate('/templates')}>
                                    <ArrowForwardIcon fontSize="small" />
                                </IconButton>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box >
    );
};

export default Dashboard;
