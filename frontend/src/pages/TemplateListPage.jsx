import React, { useState } from 'react';
import { Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { AVAILABLE_TEMPLATES, DUMMY_RESUME_DATA } from '../constants/templates';
import ResumeCard from '../components/ResumeCard';
import PageHeader from '../components/PageHeader';

const TemplateListPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // Get user from context
    const [loadingId, setLoadingId] = useState(null);
    const [isPremiumUser, setIsPremiumUser] = useState(false);

    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await authService.getProfile();
                setIsPremiumUser(res.data.isPremium || false);
            } catch (error) {
                console.error("Failed to load profile", error);
            }
        };
        fetchProfile();
    }, []);

    const handleCreateResume = async (templateId, isPremium) => {
        // 1. Verification Check
        if (user && !user.emailVerified) {
            alert("Please verify your email address to create a resume.");
            return;
        }

        // 2. Premium Check
        if (isPremium && !isPremiumUser) {
            if (window.confirm("This is a Premium template. Upgrade to Pro to use it?")) {
                navigate('/payment');
            }
            return;
        }

        setLoadingId(templateId);
        try {
            // Create a new resume
            const res = await authService.createResume({
                title: "My Resume",
                template: { theme: templateId, colorPalette: ['blue'] }
            });
            const newId = res.data.id || res.data._id;
            navigate(`/resumes/${newId}`);
        } catch (error) {
            console.error(error);
            alert("Failed to create resume");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <Container maxWidth={false} sx={{ py: 6, px: { xs: 2, md: 6 } }}>
            <PageHeader
                title="Choose Your Template"
                subtitle="Select a professionally designed template to stand out. ATS-friendly or Creative, we have it all."
                sx={{ mb: 6 }}
            />

            <Grid container spacing={4}>
                {AVAILABLE_TEMPLATES.map((template) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template.id} display="flex">
                        <ResumeCard
                            isTemplate
                            isPremium={template.isPremium}
                            title={template.name}
                            description={template.description}
                            data={DUMMY_RESUME_DATA}
                            templateId={template.id}
                            palette="blue"
                            onSelect={() => handleCreateResume(template.id, template.isPremium)}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default TemplateListPage;
