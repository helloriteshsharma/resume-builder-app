import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Box, Stepper, Step, StepLabel, Button, Typography, TextField, Paper, Grid, IconButton, Fab, Dialog, useMediaQuery, Accordion, AccordionSummary, AccordionDetails, Divider,
    Tooltip, Slide, AppBar, Toolbar, Stack, CircularProgress, InputBase
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useForm, useFieldArray } from 'react-hook-form';
import {
    DeleteOutline as DeleteIcon,
    AddCircleOutline as AddIcon,
    Save as SaveIcon,
    Visibility as VisibilityIcon,
    Close as CloseIcon,
    ExpandMore as ExpandMoreIcon,
    ExitToApp as ExitToAppIcon,
    GridView as GridViewIcon,
    Check as CheckIcon,
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
    Description as DescriptionIcon,
    Edit as EditIcon,
} from '@mui/icons-material';

import LivePreview, { TEMPLATE_IDS, COLOR_PALETTES, TEMPLATE_MAP } from '../components/LivePreview';
import { authService } from '../services/api';
import debounce from 'lodash.debounce';
import { useParams, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import EmailModal from '../components/EmailModal';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

import { AVAILABLE_TEMPLATES } from '../constants/templates';

const steps = ['Personal', 'Experience', 'Education', 'Projects', 'Skills'];

import { defaultValues, transformToBackend, transformToFrontend } from '../utils/resumeMapper';

const ResumeEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // State
    const [resumeId, setResumeId] = useState(null);
    const [resumeTitle, setResumeTitle] = useState('Untitled Resume');
    const [saveStatus, setSaveStatus] = useState('Initializing...');
    const [isInitializing, setIsInitializing] = useState(true);
    const initializationStarted = useRef(false); // Prevent double-fire in StrictMode

    const [activeStep, setActiveStep] = useState(0);
    const [previewOpen, setPreviewOpen] = useState(false); // Mobile preview toggle
    const [galleryOpen, setGalleryOpen] = useState(false);

    // Template State
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATE_IDS.MODERN);
    const [selectedColor, setSelectedColor] = useState('blue');
    const [previewTemplate, setPreviewTemplate] = useState(TEMPLATE_IDS.MODERN); // For gallery
    const [previewColor, setPreviewColor] = useState('blue'); // For gallery

    // Email Modal
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);

    // Form Setup
    const { control, handleSubmit, watch, register, getValues, reset } = useForm({
        defaultValues: defaultValues,
        mode: 'onChange'
    });

    const formData = watch();

    const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: "experience" });
    const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: "education" });
    const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({ control, name: "projects" });
    const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control, name: "skills" });
    const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({ control, name: "certifications" });
    const { fields: langFields, append: appendLang, remove: removeLang } = useFieldArray({ control, name: "languages" });
    const { fields: interestFields, append: appendInterest, remove: removeInterest } = useFieldArray({ control, name: "interests" });

    // ==================================================================================
    // 1. INITIALIZATION LOGIC (Create-on-Entry)
    // ==================================================================================
    useEffect(() => {
        const initializeResume = async () => {
            if (initializationStarted.current) return;
            initializationStarted.current = true;

            try {
                // CASE A: NEW RESUME -> Create immediately
                if (!id || id === 'new') {
                    console.log("Creating NEW Draft Resume...");
                    setSaveStatus('Creating Workspace...');

                    const createRes = await authService.createResume({
                        title: 'Untitled Resume' // Default title
                    });

                    const newId = createRes?.data?.id || createRes?.data?._id;
                    if (!newId) throw new Error("Failed to get ID from server");

                    console.log("Draft Created:", newId);
                    setResumeId(newId);
                    setSaveStatus('Draft Created');
                    setIsInitializing(false);

                    // Replace URL so we are now in "Edit" mode, not "Create" mode
                    // preventScrollReset helps keep the UI stable
                    navigate(`/resumes/${newId}`, { replace: true, preventScrollReset: true });
                }
                // CASE B: EXISTING RESUME -> Load it
                else {
                    console.log("Loading Existing Resume:", id);
                    setResumeId(id);
                    setSaveStatus('Loading...');

                    const res = await authService.getResumeById(id);
                    const cleanData = transformToFrontend(res.data);

                    // Restore template settings
                    if (cleanData._meta) {
                        if (cleanData._meta.selectedTemplate) setSelectedTemplate(cleanData._meta.selectedTemplate);
                        if (cleanData._meta.selectedColor) setSelectedColor(cleanData._meta.selectedColor);
                        if (cleanData._meta.selectedColor) setSelectedColor(cleanData._meta.selectedColor);
                        delete cleanData._meta;
                    }

                    if (cleanData.title) setResumeTitle(cleanData.title);

                    reset(cleanData);
                    setSaveStatus('Loaded');
                    setIsInitializing(false);
                }
            } catch (error) {
                console.error("Initialization Failed:", error);
                setSaveStatus('Error');
                alert(`Failed to load workspace: ${error.message || 'Unknown error'}`);
                navigate('/dashboard'); // Eject to dashboard on fatal error
            }
        };

        initializeResume();
    }, [id, navigate, reset]);


    // ==================================================================================
    // 2. AUTOSAVE LOGIC
    // ==================================================================================
    const saveToBackend = useCallback(async (data) => {
        if (!resumeId || isInitializing) return;

        setSaveStatus('Saving...');
        try {
            // Ensure title is up to date
            const title = resumeTitle || 'Untitled Resume';

            const payload = transformToBackend({ ...data, title }, selectedTemplate, selectedColor);
            await authService.updateResume(resumeId, payload);

            setSaveStatus('Saved');
        } catch (error) {
            console.error("Autosave failed", error);
            setSaveStatus('Error Saving');
        }
    }, [resumeId, isInitializing, selectedTemplate, selectedColor, resumeTitle]);

    // Debounced Autosave
    useEffect(() => {
        const handler = setTimeout(() => {
            if (resumeId && !isInitializing && formData) {
                saveToBackend(formData);
            }
        }, 1500); // 1.5s debounce

        return () => clearTimeout(handler);
    }, [formData, resumeId, isInitializing, saveToBackend]); // Dependencies updated


    // ==================================================================================
    // 3. ACTION HANDLERS
    // ==================================================================================

    const handleSaveAndExit = async () => {
        await saveToBackend(formData);
        navigate('/resumes');
    };

    const handleFinish = async () => {
        await saveToBackend(formData);
        // You could add a "Success" toast here
        navigate('/resumes');
    };

    const generatePdfBlob = async () => {
        // Target the hidden clean container instead of the live preview
        const element = document.getElementById('resume-pdf-hidden-target');
        if (!element) return null;

        // PDF Options
        const opt = {
            margin: 0,
            filename: 'resume.pdf',
            image: { type: 'jpeg', quality: 0.95 }, // Standard quality
            html2canvas: { scale: 2, useCORS: true, letterRendering: true }, // Balanced scale
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        try {
            return await html2pdf().set(opt).from(element).output('blob');
        } catch (error) {
            console.error("PDF Gen Error", error);
            alert("PDF Generation Failed: " + error.message);
            return null;
        }
    };

    const handleEmailClick = () => setEmailModalOpen(true);

    const handleSendEmail = async (emailData) => {
        setSendingEmail(true);
        try {
            const blob = await generatePdfBlob();
            if (!blob) throw new Error("Failed to generate PDF. Blob is null.");
            console.log("Generated PDF Blob size:", blob.size);

            const formData = new FormData();
            formData.append('recipientEmail', emailData.recipientEmail);
            formData.append('subject', emailData.subject || "Resume");
            formData.append('message', emailData.message || "Please find my resume attached.");
            formData.append('pdfFile', blob, "Resume.pdf");

            const res = await authService.sendResume(formData);
            console.log("Email response:", res);
            if (res.data.success) {
                alert(`Email sent!`);
                setEmailModalOpen(false);
            } else {
                console.error("Email failed response:", res.data);
                alert("Failed: " + (res.data.message || "Unknown server error"));
            }
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Error sending email: " + error.message);
        } finally {
            setSendingEmail(false);
        }
    };

    const handleOpenGallery = () => {
        setPreviewTemplate(selectedTemplate);
        setPreviewColor(selectedColor);
        setGalleryOpen(true);
    };

    const handleApplyTemplate = () => {
        setSelectedTemplate(previewTemplate);
        setSelectedColor(previewColor);
        setGalleryOpen(false);
        // Trigger manual save to persist template change
        if (resumeId) {
            // We can't pass formData directly because it might be stale in this closure
            // But the useEffect autosave will catch the state change of selectedTemplate
            // So we actually don't strictly need to do anything here, the dependency array handles it.
        }
    };

    // UI HELPER: Styled Buttons
    const ControlBtn = ({ children, ...props }) => (
        <Button
            sx={{
                borderRadius: '12px',
                textTransform: 'none',
                px: 4,
                py: 1,
                fontWeight: 'bold',
                boxShadow: props.variant === 'contained' ? '0 4px 14px 0 rgba(0,118,255,0.39)' : 'none',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: props.variant === 'contained' ? '0 6px 20px rgba(0,118,255,0.23)' : 'none',
                },
                ...props.sx
            }}
            {...props}
        >
            {children}
        </Button>
    );

    // Render Form Steps
    const renderStepContent = (step) => {
        const commonProps = { size: "small", variant: "outlined", InputLabelProps: { shrink: true } };

        switch (step) {
            case 0:
                return (
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}><Typography variant="subtitle1" fontWeight="bold">Who are you?</Typography></Grid>
                        <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Full Name" placeholder="e.g. John Doe" {...register("personal.fullName")} {...commonProps} /></Grid>
                        <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Current Role" placeholder="e.g. Software Engineer" {...register("personal.designation")} {...commonProps} /></Grid>
                        <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Email" {...register("personal.email")} {...commonProps} /></Grid>
                        <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Phone" {...register("personal.phoneNumber")} {...commonProps} /></Grid>
                        <Grid size={{ xs: 12 }}><TextField fullWidth label="Location" placeholder="City, Country" {...register("personal.location")} {...commonProps} /></Grid>

                        <Grid size={{ xs: 12 }}><Divider sx={{ my: 1 }} /></Grid>
                        <Grid size={{ xs: 12 }}><Typography variant="subtitle2" color="text.secondary">Social Profiles</Typography></Grid>
                        <Grid size={{ xs: 12, md: 4 }}><TextField fullWidth label="LinkedIn URL" {...register("personal.linkedin")} {...commonProps} /></Grid>
                        <Grid size={{ xs: 12, md: 4 }}><TextField fullWidth label="GitHub URL" {...register("personal.github")} {...commonProps} /></Grid>
                        <Grid size={{ xs: 12, md: 4 }}><TextField fullWidth label="Portfolio URL" {...register("personal.website")} {...commonProps} /></Grid>

                        <Grid size={{ xs: 12 }}><TextField fullWidth multiline rows={4} label="Professional Summary" placeholder="Briefly describe your experience and goals..." {...register("personal.summary")} {...commonProps} /></Grid>
                    </Grid>
                );
            case 1:
                return (
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Work History</Typography>
                        {expFields.map((item, index) => (
                            <Paper key={item.id} elevation={0} sx={{ mb: 2, border: '1px solid #eee', borderRadius: 2, overflow: 'hidden' }}>
                                <Accordion defaultExpanded disableGutters elevation={0}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#f8f9fa' }}>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {getValues(`experience.${index}.company`) || `Role ${index + 1}`}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 2 }}>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Company" {...register(`experience.${index}.company`)} {...commonProps} /></Grid>
                                            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Role" {...register(`experience.${index}.role`)} {...commonProps} /></Grid>
                                            <Grid size={{ xs: 6 }}><TextField fullWidth label="Start Date" placeholder="YYYY-MM" {...register(`experience.${index}.startDate`)} {...commonProps} /></Grid>
                                            <Grid size={{ xs: 6 }}><TextField fullWidth label="End Date" placeholder="YYYY-MM or Present" {...register(`experience.${index}.endDate`)} {...commonProps} /></Grid>
                                            <Grid size={{ xs: 12 }}><TextField fullWidth multiline rows={3} label="Description" placeholder="• Achieved X using Y..." {...register(`experience.${index}.description`)} {...commonProps} /></Grid>
                                            <Grid size={{ xs: 12 }} align="right">
                                                <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => removeExp(index)}>Remove</Button>
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </Paper>
                        ))}
                        <Button variant="outlined" startIcon={<AddIcon />} fullWidth onClick={() => appendExp({})} sx={{ borderStyle: 'dashed', height: 48, borderRadius: 2 }}>Add Position</Button>
                    </Box>
                );
            case 2:
                return (
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Education</Typography>
                        {eduFields.map((item, index) => (
                            <Paper key={item.id} elevation={0} sx={{ mb: 2, border: '1px solid #eee', borderRadius: 2, p: 2, position: 'relative' }}>
                                <IconButton size="small" color="error" onClick={() => removeEdu(index)} sx={{ position: 'absolute', top: 8, right: 8 }}><CloseIcon fontSize="small" /></IconButton>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12 }}><TextField fullWidth label="Institution / University" {...register(`education.${index}.institution`)} {...commonProps} /></Grid>
                                    <Grid size={{ xs: 8 }}><TextField fullWidth label="Degree / Major" {...register(`education.${index}.degree`)} {...commonProps} /></Grid>
                                    <Grid size={{ xs: 4 }}><TextField fullWidth label="Graduation Year" {...register(`education.${index}.year`)} {...commonProps} /></Grid>
                                </Grid>
                            </Paper>
                        ))}
                        <Button variant="outlined" startIcon={<AddIcon />} fullWidth onClick={() => appendEdu({})} sx={{ borderStyle: 'dashed', height: 48, borderRadius: 2 }}>Add Education</Button>
                    </Box>
                );
            case 3:
                return (
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Key Projects</Typography>
                        {projFields.map((item, index) => (
                            <Paper key={item.id} elevation={0} sx={{ mb: 2, border: '1px solid #eee', borderRadius: 2, overflow: 'hidden' }}>
                                <Accordion defaultExpanded disableGutters elevation={0}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#f8f9fa' }}>
                                        <Typography variant="subtitle2" fontWeight="bold">{getValues(`projects.${index}.title`) || `Project ${index + 1}`}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 2 }}>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12 }}><TextField fullWidth label="Project Title" {...register(`projects.${index}.title`)} {...commonProps} /></Grid>
                                            <Grid size={{ xs: 12 }}><TextField fullWidth multiline rows={2} label="Description" {...register(`projects.${index}.description`)} {...commonProps} /></Grid>
                                            <Grid size={{ xs: 6 }}><TextField fullWidth label="GitHub Link" {...register(`projects.${index}.github`)} {...commonProps} /></Grid>
                                            <Grid size={{ xs: 6 }}><TextField fullWidth label="Live Demo Link" {...register(`projects.${index}.liveDemo`)} {...commonProps} /></Grid>
                                            <Grid size={{ xs: 12 }} align="right"><Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => removeProj(index)}>Remove</Button></Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </Paper>
                        ))}
                        <Button variant="outlined" startIcon={<AddIcon />} fullWidth onClick={() => appendProj({})} sx={{ borderStyle: 'dashed', height: 48, borderRadius: 2 }}>Add Project</Button>
                    </Box>
                );
            case 4:
                return (
                    <Box>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Skills & Languages</Typography>
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>Technical Skills</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                        {skillFields.map((item, index) => (
                                            <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f5f5f5', borderRadius: 4, pl: 1, pr: 0.5, py: 0.5 }}>
                                                <TextField variant="standard" placeholder="Skill" {...register(`skills.${index}.name`)} InputProps={{ disableUnderline: true }} sx={{ width: 100, px: 1 }} />
                                                <IconButton size="small" color="default" onClick={() => removeSkill(index)}><CloseIcon fontSize="small" /></IconButton>
                                            </Box>
                                        ))}
                                        <IconButton color="primary" onClick={() => appendSkill({})}><AddIcon /></IconButton>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>Languages</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {langFields.map((item, index) => (
                                            <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f5f5f5', borderRadius: 4, pl: 1, pr: 0.5, py: 0.5 }}>
                                                <TextField variant="standard" placeholder="Language" {...register(`languages.${index}.name`)} InputProps={{ disableUnderline: true }} sx={{ width: 100, px: 1 }} />
                                                <IconButton size="small" color="default" onClick={() => removeLang(index)}><CloseIcon fontSize="small" /></IconButton>
                                            </Box>
                                        ))}
                                        <IconButton color="primary" onClick={() => appendLang({})}><AddIcon /></IconButton>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Additional</Typography>
                                <Accordion defaultExpanded sx={{ boxShadow: 0, border: '1px solid #eee', borderRadius: '8px !important', '&:before': { display: 'none' } }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="subtitle2">Certifications & Interests</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="caption" color="text.secondary" display="block" mb={1}>Certifications</Typography>
                                        {certFields.map((item, index) => (
                                            <Grid container spacing={1} key={item.id} sx={{ mb: 1, alignItems: 'center' }}>
                                                <Grid size={{ xs: 5 }}><TextField {...commonProps} fullWidth placeholder="Title" {...register(`certifications.${index}.title`)} /></Grid>
                                                <Grid size={{ xs: 4 }}><TextField {...commonProps} fullWidth placeholder="Issuer" {...register(`certifications.${index}.issuer`)} /></Grid>
                                                <Grid size={{ xs: 2 }}><TextField {...commonProps} fullWidth placeholder="Year" {...register(`certifications.${index}.year`)} /></Grid>
                                                <Grid size={{ xs: 1 }}><IconButton size="small" color="error" onClick={() => removeCert(index)}><DeleteIcon fontSize="small" /></IconButton></Grid>
                                            </Grid>
                                        ))}
                                        <Button startIcon={<AddIcon />} size="small" onClick={() => appendCert({})}>Add Cert</Button>

                                        <Divider sx={{ my: 2 }} />

                                        <Typography variant="caption" color="text.secondary" display="block" mb={1}>Interests</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {interestFields.map((item, index) => (
                                                <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f0f4ff', borderRadius: 4, pl: 1, pr: 0.5, py: 0.5 }}>
                                                    <TextField variant="standard" placeholder="Interest" {...register(`interests.${index}.name`)} InputProps={{ disableUnderline: true }} sx={{ width: 100, px: 1 }} />
                                                    <IconButton size="small" color="default" onClick={() => removeInterest(index)}><CloseIcon fontSize="small" /></IconButton>
                                                </Box>
                                            ))}
                                            <IconButton color="primary" onClick={() => appendInterest({})}><AddIcon /></IconButton>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        </Grid>
                    </Box>
                );
            default: return "End";
        }
    };

    // ===================================
    // RENDER: LOADING STATE
    // ===================================
    if (isInitializing) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: '#f3f4f6' }}>
                <CircularProgress size={50} sx={{ mb: 3 }} />
                <Typography variant="h6" color="text.secondary">
                    {saveStatus === 'Creating Workspace...' ? 'Setting up your workspace...' : 'Loading your resume...'}
                </Typography>
            </Box>
        );
    }

    // ===================================
    // RENDER: MAIN EDITOR
    // ===================================
    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: '#f3f4f6' }}>
            {/* Editor Panel - 40% Width (Desktop) / 100% (Mobile) */}
            <Paper
                elevation={4}
                sx={{
                    width: { xs: '100%', md: '440px', lg: '40%' },
                    height: '100%',
                    display: 'flex', flexDirection: 'column',
                    zIndex: 2,
                    borderRadius: { md: '0 16px 16px 0' },
                    borderRight: '1px solid rgba(0,0,0,0.05)'
                }}
            >
                {/* Header */}
                <Box sx={{ p: 2, px: 3, pt: 3, bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton size="small" onClick={() => navigate('/resumes')}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <InputBase
                                value={resumeTitle}
                                onChange={(e) => setResumeTitle(e.target.value)}
                                onBlur={() => saveToBackend(formData)} // Trigger save on blur
                                sx={{
                                    fontSize: '1.1rem',
                                    fontWeight: '800',
                                    color: '#1e293b',
                                    '& input': { p: 0 }
                                }}
                            />
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: saveStatus === 'Saved' ? 'green' : 'orange' }} />
                                <Typography variant="caption" color="text.secondary" fontWeight="500">
                                    {saveStatus}
                                </Typography>
                            </Stack>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Templates">
                            <IconButton onClick={handleOpenGallery} sx={{ bgcolor: '#f5f3ff', color: '#7c3aed', '&:hover': { bgcolor: '#ede9fe' } }}>
                                <GridViewIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Export PDF">
                            <IconButton onClick={handleEmailClick} sx={{ bgcolor: '#eff6ff', color: '#2563eb', '&:hover': { bgcolor: '#dbeafe' } }}>
                                <DescriptionIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Exit">
                            <IconButton onClick={handleSaveAndExit} sx={{ bgcolor: '#fef2f2', color: '#dc2626', '&:hover': { bgcolor: '#fee2e2' } }}>
                                <ExitToAppIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Stepper */}
                <Box sx={{ px: 2, py: 2, bgcolor: 'white' }}>
                    <Stepper activeStep={activeStep} alternativeLabel data-html2canvas-ignore sx={{ '& .MuiStepLabel-label': { mt: 0.5, fontSize: '0.7rem', fontWeight: 600 } }}>
                        {steps.map((label, idx) => (
                            <Step key={label} onClick={() => setActiveStep(idx)} sx={{ cursor: 'pointer' }}>
                                <StepLabel StepIconProps={{ sx: { width: 18, height: 18, fontSize: '0.75rem' } }}>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                {/* Form Content */}
                <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto', bgcolor: '#fff' }}>
                    {/* We don't need onSubmit for the form itself anymore, just manual handlers */}
                    <form onSubmit={(e) => e.preventDefault()}>
                        {renderStepContent(activeStep)}
                    </form>
                    {/* Spacer for bottom nav */}
                    <Box sx={{ height: 80 }} />
                </Box>

                {/* Bottom Navigation */}
                <Box sx={{ p: 2, px: 3, bgcolor: 'white', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ControlBtn
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep(p => p - 1)}
                        startIcon={<ArrowBackIcon />}
                        variant="text"
                        color="inherit"
                    >
                        Back
                    </ControlBtn>

                    {/* Mobile Preview Button */}
                    <Button
                        display={{ xs: 'flex', md: 'none' }}
                        variant="outlined"
                        color="secondary"
                        onClick={() => setPreviewOpen(true)}
                        startIcon={<VisibilityIcon />}
                        sx={{ display: { md: 'none' }, borderRadius: 8, mx: 1 }}
                    >
                        Preview
                    </Button>

                    <Box>
                        {activeStep === steps.length - 1 ? (
                            <ControlBtn variant="contained" color="success" startIcon={<SaveIcon />} onClick={handleFinish}>Finish</ControlBtn>
                        ) : (
                            <ControlBtn variant="contained" onClick={() => setActiveStep(p => p + 1)} endIcon={<ArrowForwardIcon />}>Next</ControlBtn>
                        )}
                    </Box>
                </Box>
            </Paper>

            {/* Live Preview Panel - 60% Width */}
            <Box
                id="resume-preview-content"
                sx={{
                    flexGrow: 1,
                    bgcolor: '#e5e7eb',
                    display: { xs: 'none', md: 'block' },
                    position: 'relative',
                    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            >
                <LivePreview data={formData} templateId={selectedTemplate} palette={selectedColor} />
            </Box>

            {/* =========================================================================
                                      TEMPLATE GALLERY DIALOG
               ========================================================================= */}
            <Dialog
                maxWidth="xl"
                fullWidth
                open={galleryOpen}
                onClose={() => setGalleryOpen(false)}
                TransitionComponent={Transition}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: 'hidden',
                        height: '90vh',
                        bgcolor: '#f8fafc'
                    }
                }}
            >
                <AppBar sx={{ position: 'relative', bgcolor: 'white', color: '#1e293b', boxShadow: 'none', borderBottom: '1px solid #e2e8f0' }}>
                    <Toolbar sx={{ minHeight: 70 }}>
                        <IconButton edge="start" onClick={() => setGalleryOpen(false)} sx={{ color: '#64748b' }}>
                            <CloseIcon />
                        </IconButton>
                        <Stack sx={{ ml: 2, flex: 1 }}>
                            <Typography variant="h6" fontWeight="800" sx={{ letterSpacing: '-0.5px' }}>
                                Choose a Template
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Select a design that matches your professional style
                            </Typography>
                        </Stack>
                        <Button
                            variant="contained"
                            onClick={async () => {
                                // 1. Update Local State
                                setSelectedTemplate(previewTemplate);
                                setSelectedColor(previewColor);
                                setGalleryOpen(false);

                                // 2. Immediate Save (Persist Data + New Template)
                                if (resumeId) {
                                    setSaveStatus('Saving Theme...');
                                    try {
                                        const title = resumeTitle || 'Untitled Resume';
                                        // Use the NEW template/color, but current formData
                                        const payload = transformToBackend({ ...formData, title }, previewTemplate, previewColor);
                                        await authService.updateResume(resumeId, payload);
                                        setSaveStatus('Saved');
                                    } catch (error) {
                                        console.error("Template Save Failed", error);
                                        setSaveStatus('Error Saving');
                                    }
                                }
                            }}
                            startIcon={<CheckIcon />}
                            sx={{
                                borderRadius: '10px',
                                px: 3,
                                py: 1,
                                fontWeight: 'bold',
                                textTransform: 'none',
                                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.1), 0 2px 4px -1px rgba(37, 99, 235, 0.06)'
                            }}
                        >
                            Apply Design
                        </Button>
                    </Toolbar>
                </AppBar>

                <Grid container sx={{ height: 'calc(100% - 70px)' }}>
                    {/* Sidebar: Controls */}
                    <Grid size={{ xs: 12, md: 3 }} sx={{ height: '100%', borderRight: '1px solid #e2e8f0', overflowY: 'auto', p: 0, bgcolor: 'white' }}>
                        <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
                            <Typography variant="subtitle2" fontWeight="800" sx={{ mb: 2, color: '#334155', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                                Accent Color
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                {Object.keys(COLOR_PALETTES).map(colorKey => (
                                    <Tooltip title={colorKey.charAt(0).toUpperCase() + colorKey.slice(1)} key={colorKey}>
                                        <Box onClick={() => setPreviewColor(colorKey)}
                                            sx={{
                                                width: 40, height: 40,
                                                borderRadius: '50%',
                                                bgcolor: COLOR_PALETTES[colorKey].primary,
                                                cursor: 'pointer',
                                                border: '2px solid white',
                                                boxShadow: previewColor === colorKey
                                                    ? `0 0 0 2px ${COLOR_PALETTES[colorKey].primary}, 0 4px 6px -1px rgba(0,0,0,0.1)`
                                                    : '0 1px 3px 0 rgba(0,0,0,0.1)',
                                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '&:hover': { transform: 'scale(1.1)' }
                                            }}
                                        />
                                    </Tooltip>
                                ))}
                            </Box>
                        </Box>

                        <Box sx={{ p: 3 }}>
                            <Typography variant="subtitle2" fontWeight="800" sx={{ mb: 2, color: '#334155', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                                Layouts
                            </Typography>
                            <Stack spacing={2}>
                                {AVAILABLE_TEMPLATES.map(tmpl => {
                                    const isSelected = previewTemplate === tmpl.id;
                                    return (
                                        <Paper
                                            key={tmpl.id}
                                            onClick={() => setPreviewTemplate(tmpl.id)}
                                            elevation={isSelected ? 0 : 0}
                                            sx={{
                                                p: 2,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                bgcolor: isSelected ? '#eff6ff' : 'white',
                                                border: '1px solid',
                                                borderColor: isSelected ? '#3b82f6' : '#e2e8f0',
                                                borderRadius: 3,
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    borderColor: '#3b82f6',
                                                    transform: 'translateY(-1px)',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                                }
                                            }}
                                        >
                                            <Box sx={{
                                                width: 48,
                                                height: 56,
                                                bgcolor: isSelected ? 'white' : '#f1f5f9',
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: isSelected ? '#3b82f6' : '#64748b',
                                                border: isSelected ? '1px solid #dbeafe' : 'none'
                                            }}>
                                                <Typography variant="h6" fontWeight="bold">Aa</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" fontWeight="700" color={isSelected ? '#1e40af' : '#1e293b'}>
                                                    {tmpl.name}
                                                </Typography>
                                                <Typography variant="caption" color={isSelected ? '#60a5fa' : 'text.secondary'} fontWeight="500">
                                                    {tmpl.type}
                                                </Typography>
                                            </Box>
                                            {isSelected && <CheckIcon fontSize="small" color="primary" sx={{ ml: 'auto' }} />}
                                        </Paper>
                                    );
                                })}
                            </Stack>
                        </Box>
                    </Grid>

                    {/* Main Area: Preview */}
                    <Grid size={{ xs: 12, md: 9 }} sx={{ height: '100%', bgcolor: '#f1f5f9', p: 4, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', overflowY: 'auto' }}>
                        <Box sx={{
                            borderRadius: 2,
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            overflow: 'hidden',
                            transformOrigin: 'top center',
                            // Scale down slightly if needed to fit
                            maxWidth: '100%'
                        }}>
                            <LivePreview data={formData} templateId={previewTemplate} palette={previewColor} />
                        </Box>
                    </Grid>
                </Grid>
            </Dialog>

            <EmailModal open={emailModalOpen} onClose={() => setEmailModalOpen(false)} onSend={handleSendEmail} sending={sendingEmail} />

            {/* Mobile Preview Dialog */}
            <Dialog fullScreen open={previewOpen} onClose={() => setPreviewOpen(false)} TransitionComponent={Transition}>
                <AppBar sx={{ position: 'relative', bgcolor: 'white', color: 'black' }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => setPreviewOpen(false)} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1, fontWeight: 'bold' }} variant="h6">
                            Live Preview
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box sx={{ flexGrow: 1, bgcolor: '#e5e7eb', height: '100%', p: 2 }}>
                    <LivePreview data={formData} templateId={selectedTemplate} palette={selectedColor} />
                </Box>
            </Dialog>



            {/* Hidden Off-Screen Container for clean PDF Generation */}
            <div
                style={{
                    position: 'absolute',
                    top: '-10000px',
                    left: '-10000px',
                }}
            >
                <div
                    id="resume-pdf-hidden-target"
                    style={{
                        width: '209.8mm', // Slightly less than 210mm to prevent horizontal overflow
                        minHeight: '296.8mm', // Slightly less than 297mm to prevent vertical overflow
                        backgroundColor: 'white',
                        boxSizing: 'border-box',
                        overflow: 'hidden'
                    }}
                >
                    {(() => {
                        const SelectedTemplateComponent = TEMPLATE_MAP[selectedTemplate];
                        const activePalette = COLOR_PALETTES[selectedColor] || COLOR_PALETTES.blue;
                        if (SelectedTemplateComponent) {
                            return <SelectedTemplateComponent data={formData} palette={activePalette} isPdf={true} />;
                        }
                        return null;
                    })()}
                </div>
            </div>
        </Box >
    );
};

export default ResumeEditor;
