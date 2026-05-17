import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Box, Typography, Divider, Chip, Paper, Grid, Avatar, Slider, IconButton } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

// ==========================================
// CONFIGURATION & UTILS
// ==========================================

export const TEMPLATE_IDS = {
    ATS_CLASSIC: 'ats-classic',
    ATS_MINIMAL: 'ats-minimal',
    MODERN: 'premium-modern',
    ELEGANT: 'premium-elegant',
    CREATIVE: 'premium-creative',
    TECH: 'premium-tech',
    EXECUTIVE: 'premium-executive'
};

export const COLOR_PALETTES = {
    blue: { primary: '#2563eb', secondary: '#eff6ff', text: '#1e293b' },
    emerald: { primary: '#059669', secondary: '#ecfdf5', text: '#064e3b' },
    purple: { primary: '#7c3aed', secondary: '#f5f3ff', text: '#4c1d95' },
    red: { primary: '#dc2626', secondary: '#fef2f2', text: '#7f1d1d' },
    slate: { primary: '#475569', secondary: '#f8fafc', text: '#1e293b' },
    orange: { primary: '#ea580c', secondary: '#fff7ed', text: '#7c2d12' },
};

const SectionHeader = ({ children, sx, variant = "h6" }) => (
    <Typography variant={variant} sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12pt', ...sx }}>
        {children}
    </Typography>
);

// CSS Utils for A4 Page
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PAGE_STYLE = {
    width: `${A4_WIDTH_MM}mm`,
    minHeight: `${A4_HEIGHT_MM}mm`,
    padding: '15mm',
    backgroundColor: 'white',
    boxSizing: 'border-box',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    margin: '0 auto',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
};

// ==========================================
// 1. ATS TEMPLATES (Text Heavy, Simple)
// ==========================================

const AtsClassic = ({ data, isPdf }) => (
    <Box sx={{ ...PAGE_STYLE, ...(isPdf && { boxShadow: 'none', margin: 0, border: 'none' }), fontFamily: '"Times New Roman", Times, serif', color: '#000', lineHeight: 1.3 }}>
        <Box sx={{ textAlign: 'center', borderBottom: '1px solid #000', pb: 2, mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.2, fontSize: '20pt' }}>
                {data.personal?.fullName}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap', mt: 1, fontSize: '10pt' }}>
                {data.personal?.email && <span>{data.personal.email}</span>}
                {data.personal?.phoneNumber && <span>| {data.personal.phoneNumber}</span>}
                {data.personal?.location && <span>| {data.personal.location}</span>}
                {data.personal?.linkedin && <span>| LinkedIn: {data.personal.linkedin}</span>}
                {data.personal?.github && <span>| GitHub: {data.personal.github}</span>}
                {data.personal?.website && <span>| Portfolio: {data.personal.website}</span>}
            </Box>
        </Box>

        {data.personal?.summary && (
            <Box sx={{ mb: 3 }}>
                <SectionHeader sx={{ borderBottom: '1px solid #000', mb: 0.5, fontSize: '11pt' }}>Professional Summary</SectionHeader>
                <Typography variant="body2" sx={{ fontSize: '10.5pt' }}>{data.personal.summary}</Typography>
            </Box>
        )}

        {data.experience?.length > 0 && (
            <Box sx={{ mb: 3 }}>
                <SectionHeader sx={{ borderBottom: '1px solid #000', mb: 0.5, fontSize: '11pt' }}>Experience</SectionHeader>
                {data.experience.map((exp, i) => (
                    <Box key={i} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '11pt' }}>{exp.company}</Typography>
                            <Typography variant="body2" sx={{ fontSize: '10pt' }}>{exp.startDate} – {exp.endDate}</Typography>
                        </Box>
                        <Typography variant="body2" fontStyle="italic" sx={{ fontSize: '10pt' }}>{exp.role}</Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line', pl: 2, mt: 0.5, fontSize: '10.5pt' }}>• {exp.description?.replace(/\n/g, "\n• ")}</Typography>
                    </Box>
                ))}
            </Box>
        )}

        {data.education?.length > 0 && (
            <Box sx={{ mb: 3 }}>
                <SectionHeader sx={{ borderBottom: '1px solid #000', mb: 0.5, fontSize: '11pt' }}>Education</SectionHeader>
                {data.education.map((edu, i) => (
                    <Box key={i} sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '11pt' }}>{edu.institution}</Typography>
                            <Typography variant="body2" sx={{ fontSize: '10pt' }}>{edu.degree}</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontSize: '10pt' }}>{edu.year}</Typography>
                    </Box>
                ))}
            </Box>
        )}

        {data.projects?.length > 0 && (
            <Box sx={{ mb: 3 }}>
                <SectionHeader sx={{ borderBottom: '1px solid #000', mb: 0.5, fontSize: '11pt' }}>Projects</SectionHeader>
                {data.projects.map((proj, i) => (
                    <Box key={i} sx={{ mb: 1.5 }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '10.5pt' }}>{proj.title}
                            {proj.liveDemo && <a href={proj.liveDemo} style={{ color: 'inherit', fontWeight: 'normal', marginLeft: '5px' }}>[Demo]</a>}
                            {proj.github && <a href={proj.github} style={{ color: 'inherit', fontWeight: 'normal', marginLeft: '5px' }}>[Code]</a>}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '10pt' }}>{proj.description}</Typography>
                    </Box>
                ))}
            </Box>
        )}

        {(data.skills?.length > 0 || data.languages?.length > 0) && (
            <Box sx={{ mb: 3 }}>
                <SectionHeader sx={{ borderBottom: '1px solid #000', mb: 0.5, fontSize: '11pt' }}>Skills & Languages</SectionHeader>
                <Typography variant="body2" sx={{ fontSize: '10.5pt' }}>
                    <b>Skills:</b> {data.skills?.map(s => s.name).join(' • ')}
                </Typography>
                {data.languages?.length > 0 && (
                    <Typography variant="body2" sx={{ fontSize: '10.5pt', mt: 0.5 }}>
                        <b>Languages:</b> {data.languages?.map(s => s.name).join(' • ')}
                    </Typography>
                )}
            </Box>
        )}

        {data.certifications?.length > 0 && (
            <Box sx={{ mb: 3 }}>
                <SectionHeader sx={{ borderBottom: '1px solid #000', mb: 0.5, fontSize: '11pt' }}>Certifications</SectionHeader>
                {data.certifications.map((cert, i) => (
                    <Typography key={i} variant="body2" sx={{ fontSize: '10.5pt' }}>
                        • <b>{cert.title}</b>, {cert.issuer} ({cert.year})
                    </Typography>
                ))}
            </Box>
        )}

        {data.interests?.length > 0 && data.interests[0]?.name && (
            <Box sx={{ mb: 3 }}>
                <SectionHeader sx={{ borderBottom: '1px solid #000', mb: 0.5, fontSize: '11pt' }}>Interests</SectionHeader>
                <Typography variant="body2" sx={{ fontSize: '10.5pt' }}>{data.interests.map(i => i.name).join(', ')}</Typography>
            </Box>
        )}
    </Box>
);

const AtsMinimal = ({ data, isPdf }) => (
    <Box sx={{ ...PAGE_STYLE, ...(isPdf && { boxShadow: 'none', margin: 0, border: 'none' }), fontFamily: 'Arial, Helvetica, sans-serif', color: '#333', lineHeight: 1.4 }}>
        <Box sx={{ mb: 4 }}>
            <Typography variant="h3" fontWeight="bold" sx={{ color: '#000', fontSize: '24pt' }}>{data.personal?.fullName}</Typography>
            <Typography variant="body1" sx={{ mt: 1, fontSize: '10pt' }}>
                {[data.personal?.email, data.personal?.phoneNumber, data.personal?.location, data.personal?.linkedin].filter(Boolean).join('  |  ')}
            </Typography>
        </Box>

        {data.personal?.summary && (
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 0.5, fontSize: '10pt' }}>Summary</Typography>
                <Divider sx={{ mb: 1, borderColor: '#333' }} />
                <Typography variant="body2" sx={{ fontSize: '10pt' }}>{data.personal.summary}</Typography>
            </Box>
        )}

        {data.experience?.length > 0 && (
            <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 0.5, fontSize: '10pt' }}>Experience</Typography>
                <Divider sx={{ mb: 2, borderColor: '#333' }} />
                {data.experience.map((exp, i) => (
                    <Box key={i} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '11pt' }}>{exp.role}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '10pt' }}>{exp.startDate} - {exp.endDate}</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="500" sx={{ fontSize: '10pt' }}>{exp.company}</Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, fontSize: '10pt' }}>{exp.description}</Typography>
                    </Box>
                ))}
            </Box>
        )}

        {data.education?.length > 0 && (
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 0.5, fontSize: '10pt' }}>Education</Typography>
                <Divider sx={{ mb: 1, borderColor: '#333' }} />
                {data.education.map((edu, i) => (
                    <Box key={i} sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '10pt' }}>{edu.institution}</Typography>
                        <Typography variant="body2" sx={{ fontSize: '10pt' }}>{edu.degree} ({edu.year})</Typography>
                    </Box>
                ))}
            </Box>
        )}

        {data.projects?.length > 0 && (
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 0.5, fontSize: '10pt' }}>Projects</Typography>
                <Divider sx={{ mb: 1, borderColor: '#333' }} />
                {data.projects.map((proj, i) => (
                    <Box key={i} sx={{ mb: 1.5 }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '10pt' }}>{proj.title}</Typography>
                        <Typography variant="body2" sx={{ fontSize: '10pt' }}>{proj.description}</Typography>
                    </Box>
                ))}
            </Box>
        )}

        <Box sx={{ display: 'flex', gap: 4 }}>
            <Box flex={1}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 0.5, fontSize: '10pt' }}>Skills</Typography>
                <Divider sx={{ mb: 1, borderColor: '#333' }} />
                <Typography variant="body2" sx={{ fontSize: '10pt' }}>{data.skills?.map(s => s.name).join(', ')}</Typography>
            </Box>
            {data.certifications?.length > 0 && (
                <Box flex={1}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 0.5, fontSize: '10pt' }}>Certifications</Typography>
                    <Divider sx={{ mb: 1, borderColor: '#333' }} />
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                        {data.certifications.map((c, i) => (
                            <li key={i}><Typography variant="body2" sx={{ fontSize: '10pt' }}>{c.title}</Typography></li>
                        ))}
                    </ul>
                </Box>
            )}
        </Box>
    </Box>
);

// ==========================================
// 2. PREMIUM TEMPLATES (Visual, Styled)
// ==========================================

const PremiumModern = ({ data, palette, isPdf }) => (
    <Box sx={{ ...PAGE_STYLE, ...(isPdf && { boxShadow: 'none', margin: 0, border: 'none' }), display: 'flex', padding: 0, fontFamily: '"Inter", sans-serif' }}>
        {/* Sidebar */}
        <Box sx={{ width: '30%', bgcolor: palette.primary, color: 'white', p: 3, boxSizing: 'border-box' }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 2, fontSize: '2rem' }}>
                    {data.personal?.fullName?.charAt(0) || 'U'}
                </Avatar>
                <Typography variant="h6" fontWeight="bold" lineHeight={1.2} sx={{ fontSize: '16pt' }}>{data.personal?.fullName}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 1, fontSize: '10pt' }}>{data.personal?.designation}</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: '9pt', mb: 4 }}>
                {data.personal?.email && <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}><EmailIcon fontSize="small" /> {data.personal.email}</Box>}
                {data.personal?.phoneNumber && <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}><PhoneIcon fontSize="small" /> {data.personal.phoneNumber}</Box>}
                {data.personal?.location && <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}><LocationOnIcon fontSize="small" /> {data.personal.location}</Box>}
                {data.personal?.website && <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}><LanguageIcon fontSize="small" /> {data.personal.website}</Box>}
            </Box>

            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ borderBottom: '1px solid rgba(255,255,255,0.3)', pb: 1, mb: 2, fontSize: '10pt' }}>SKILLS</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 3 }}>
                    {data.skills?.map((s, i) => (
                        <Chip key={i} label={s.name} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', fontSize: '8pt' }} />
                    ))}
                </Box>
            </Box>

            {data.languages?.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ borderBottom: '1px solid rgba(255,255,255,0.3)', pb: 1, mb: 2, fontSize: '10pt' }}>LANGUAGES</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 3 }}>
                        {data.languages.map((l, i) => <Typography key={i} variant="caption" display="block">• {l.name}</Typography>)}
                    </Box>
                </Box>
            )}
        </Box>

        {/* Main Content */}
        <Box sx={{ width: '70%', p: 4, bgcolor: '#fff', boxSizing: 'border-box' }}>
            {data.personal?.summary && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: palette.primary, mb: 1, fontSize: '12pt' }}>PROFILE</Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.5} sx={{ fontSize: '10pt' }}>{data.personal.summary}</Typography>
                </Box>
            )}

            {data.experience?.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: palette.primary, mb: 2, fontSize: '12pt' }}>EXPERIENCE</Typography>
                    {data.experience.map((exp, i) => (
                        <Box key={i} sx={{ mb: 3, position: 'relative', pl: 2, borderLeft: `2px solid ${palette.secondary}` }}>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '11pt' }}>{exp.role}</Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '9pt' }}>
                                {exp.company} | {exp.startDate} - {exp.endDate}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5, fontSize: '10pt' }}>{exp.description}</Typography>
                        </Box>
                    ))}
                </Box>
            )}

            {data.projects?.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: palette.primary, mb: 2, fontSize: '12pt' }}>PROJECTS</Typography>
                    {data.projects.map((proj, i) => (
                        <Box key={i} sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '10.5pt' }}>{proj.title}</Typography>
                            <Typography variant="body2" sx={{ fontSize: '10pt' }}>{proj.description}</Typography>
                        </Box>
                    ))}
                </Box>
            )}

            {data.education?.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: palette.primary, mb: 2, fontSize: '12pt' }}>EDUCATION</Typography>
                    {data.education.map((edu, i) => (
                        <Box key={i} sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '10pt' }}>{edu.institution}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '9pt' }}>{edu.degree}, {edu.year}</Typography>
                        </Box>
                    ))}
                </Box>
            )}

            {data.certifications?.length > 0 && (
                <Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: palette.primary, mb: 2, fontSize: '12pt' }}>CERTIFICATIONS</Typography>
                    {data.certifications.map((c, i) => (
                        <Typography key={i} variant="body2" sx={{ fontSize: '9pt', mb: 0.5 }}>• {c.title} - {c.issuer}</Typography>
                    ))}
                </Box>
            )}
        </Box>
    </Box>
);

const PremiumElegant = ({ data, palette, isPdf }) => (
    <Box sx={{ ...PAGE_STYLE, ...(isPdf && { boxShadow: 'none', margin: 0, border: 'none' }), fontFamily: 'Georgia, serif', color: '#333' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{ color: palette.primary, letterSpacing: 2, mb: 1, fontSize: '22pt' }}>{data.personal?.fullName}</Typography>
            <Typography variant="subtitle1" sx={{ color: '#666', fontStyle: 'italic', fontSize: '12pt' }}>{data.personal?.designation}</Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 3, fontSize: '10pt', color: '#555' }}>
                <span>{data.personal?.email}</span>
                <span>{data.personal?.phoneNumber}</span>
                <span>{data.personal?.location}</span>
            </Box>
        </Box>

        <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
                {data.personal?.summary && (
                    <Typography variant="body1" sx={{ textAlign: 'center', fontStyle: 'italic', maxWidth: '90%', mx: 'auto', mb: 3, lineHeight: 1.6, fontSize: '11pt' }}>
                        "{data.personal.summary}"
                    </Typography>
                )}
            </Grid>

            <Grid size={{ xs: 8 }} sx={{ borderRight: '1px solid #eee' }}>
                {data.experience?.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ borderBottom: `2px solid ${palette.primary}`, display: 'inline-block', pb: 0.5, mb: 2, color: palette.text, fontSize: '12pt' }}>
                            Professional Experience
                        </Typography>
                        {data.experience.map((exp, i) => (
                            <Box key={i} sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ fontSize: '11pt', fontWeight: 'bold' }}>{exp.company}</Typography>
                                <Typography variant="subtitle2" sx={{ color: palette.primary, mb: 0.5, fontSize: '10pt' }}>{exp.role} &nbsp;|&nbsp; {exp.startDate} — {exp.endDate}</Typography>
                                <Typography variant="body2" sx={{ lineHeight: 1.4, fontSize: '10.5pt' }}>{exp.description}</Typography>
                            </Box>
                        ))}
                    </Box>
                )}

                {data.projects?.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ borderBottom: `2px solid ${palette.primary}`, display: 'inline-block', pb: 0.5, mb: 2, color: palette.text, fontSize: '12pt' }}>
                            Key Projects
                        </Typography>
                        {data.projects.map((proj, i) => (
                            <Box key={i} sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '10.5pt' }}>{proj.title}</Typography>
                                <Typography variant="body2" sx={{ lineHeight: 1.4, fontSize: '10pt' }}>{proj.description}</Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </Grid>

            <Grid size={{ xs: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ borderBottom: `2px solid ${palette.primary}`, display: 'inline-block', pb: 0.5, mb: 2, color: palette.text, fontSize: '12pt' }}>
                        Connect
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, m: 0, typography: 'body2', fontSize: '10pt' }}>
                        {data.personal?.linkedin && <li>LinkedIn: {data.personal.linkedin}</li>}
                        {data.personal?.github && <li>GitHub: {data.personal.github}</li>}
                        {data.personal?.website && <li>Web: {data.personal.website}</li>}
                    </Box>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ borderBottom: `2px solid ${palette.primary}`, display: 'inline-block', pb: 0.5, mb: 2, color: palette.text, fontSize: '12pt' }}>
                        Expertise
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {data.skills?.map((s, i) => (
                            <Typography key={i} variant="body2" sx={{ display: 'block', width: '100%', mb: 0.5, fontSize: '10pt' }}>• {s.name}</Typography>
                        ))}
                    </Box>
                </Box>

                {data.education?.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" sx={{ borderBottom: `2px solid ${palette.primary}`, display: 'inline-block', pb: 0.5, mb: 2, color: palette.text, fontSize: '12pt' }}>
                            Education
                        </Typography>
                        {data.education.map((edu, i) => (
                            <Box key={i} sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '10pt' }}>{edu.institution}</Typography>
                                <Typography variant="caption" sx={{ fontSize: '9pt' }}>{edu.degree}, {edu.year}</Typography>
                            </Box>
                        ))}
                    </Box>
                )}

                {data.certifications?.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" sx={{ borderBottom: `2px solid ${palette.primary}`, display: 'inline-block', pb: 0.5, mb: 2, color: palette.text, fontSize: '12pt' }}>
                            Certifications
                        </Typography>
                        {data.certifications.map((c, i) => (
                            <Typography key={i} variant="caption" display="block" sx={{ mb: 0.5 }}>• {c.title}</Typography>
                        ))}
                    </Box>
                )}
            </Grid>
        </Grid>
    </Box>
);

const PremiumCreative = ({ data, palette, isPdf }) => (
    <Box sx={{ ...PAGE_STYLE, ...(isPdf && { boxShadow: 'none', margin: 0, border: 'none' }), padding: 0, fontFamily: '"Outfit", sans-serif', bgcolor: '#fff' }}>
        <Box sx={{ bgcolor: palette.primary, color: 'white', px: 5, py: 4, clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' }}>
            <Typography variant="h2" fontWeight="800" sx={{ letterSpacing: -1, fontSize: '28pt' }}>{data.personal?.fullName}</Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 300, fontSize: '14pt' }}>{data.personal?.designation}</Typography>
        </Box>

        <Box sx={{ px: 5, mt: -3 }}>
            <Paper elevation={3} sx={{ p: 2, bgcolor: 'white', borderRadius: 2 }}>
                <Grid container spacing={2} justifyContent="space-around" sx={{ fontSize: '9pt' }}>
                    <Grid size="auto" display="flex" gap={0.5} sx={{ alignItems: 'center' }}><EmailIcon sx={{ color: palette.primary, fontSize: '1.2em' }} /> {data.personal?.email}</Grid>
                    <Grid size="auto" display="flex" gap={0.5} sx={{ alignItems: 'center' }}><PhoneIcon sx={{ color: palette.primary, fontSize: '1.2em' }} /> {data.personal?.phoneNumber}</Grid>
                    <Grid size="auto" display="flex" gap={0.5} sx={{ alignItems: 'center' }}><LocationOnIcon sx={{ color: palette.primary, fontSize: '1.2em' }} /> {data.personal?.location}</Grid>
                </Grid>
            </Paper>
        </Box>

        <Box sx={{ px: 5, pt: 3 }}>
            <Grid container spacing={4}>
                <Grid size={{ xs: 7 }}>
                    {data.personal?.summary && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" fontWeight="bold" sx={{ color: palette.primary, mb: 1, fontSize: '14pt' }}>About Me</Typography>
                            <Typography variant="body1" lineHeight={1.5} color="text.secondary" sx={{ fontSize: '10.5pt' }}>{data.personal.summary}</Typography>
                        </Box>
                    )}

                    {data.experience?.length > 0 && (
                        <Box>
                            <Typography variant="h5" fontWeight="bold" sx={{ color: palette.primary, mb: 2, fontSize: '14pt' }}>Work Experience</Typography>
                            {data.experience.map((exp, i) => (
                                <Box key={i} sx={{ mb: 3, pl: 2, borderLeft: `3px solid ${palette.secondary}` }}>
                                    <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '12pt' }}>{exp.role}</Typography>
                                    <Typography variant="subtitle2" color="primary" sx={{ fontSize: '10pt' }}>{exp.company} &nbsp;•&nbsp; {exp.startDate} - {exp.endDate}</Typography>
                                    <Typography variant="body2" sx={{ mt: 0.5, fontSize: '10.5pt' }}>{exp.description}</Typography>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {data.projects?.length > 0 && (
                        <Box>
                            <Typography variant="h5" fontWeight="bold" sx={{ color: palette.primary, mb: 2, fontSize: '14pt' }}>Recent Projects</Typography>
                            {data.projects.map((proj, i) => (
                                <Box key={i} sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '11pt' }}>{proj.title}</Typography>
                                    <Typography variant="body2" sx={{ mt: 0.5, fontSize: '10pt' }}>{proj.description}</Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Grid>

                <Grid size={{ xs: 5 }}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" fontWeight="bold" sx={{ color: palette.primary, mb: 1.5, fontSize: '14pt' }}>Skills</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {data.skills?.map((s, i) => (
                                <Chip key={i} label={s.name} variant="outlined" size="small" sx={{ borderColor: palette.primary, color: palette.primary, fontWeight: 'bold', fontSize: '9pt' }} />
                            ))}
                        </Box>
                    </Box>

                    {data.education?.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h5" fontWeight="bold" sx={{ color: palette.primary, mb: 1.5, fontSize: '14pt' }}>Education</Typography>
                            {data.education.map((edu, i) => (
                                <Box key={i} sx={{ mb: 1.5, p: 1.5, bgcolor: palette.secondary, borderRadius: 2 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '10.5pt' }}>{edu.institution}</Typography>
                                    <Typography variant="body2" sx={{ fontSize: '9.5pt' }}>{edu.degree}</Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>{edu.year}</Typography>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {data.interests?.length > 0 && data.interests[0]?.name && (
                        <Box>
                            <Typography variant="h5" fontWeight="bold" sx={{ color: palette.primary, mb: 1.5, fontSize: '14pt' }}>Interests</Typography>
                            <Typography variant="body2">{data.interests.map(i => i.name).join(', ')}</Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    </Box>
);

const PremiumTech = ({ data, palette, isPdf }) => (
    <Box sx={{ ...PAGE_STYLE, ...(isPdf && { boxShadow: 'none', margin: 0, border: 'none' }), fontFamily: '"Roboto Mono", monospace', color: '#111', bgcolor: '#fff' }}>
        <Box sx={{ borderBottom: `2px solid ${palette.primary}`, pb: 2, mb: 3 }}>
            <Typography variant="h3" fontWeight="bold" sx={{ color: palette.primary, fontSize: '20pt' }}>{`> ${data.personal?.fullName || '_'}`}</Typography>
            <Typography variant="h6" sx={{ color: '#555', mt: 0.5, fontSize: '12pt' }}>{`// ${data.personal?.designation || 'Developer'}`}</Typography>
            <Box sx={{ mt: 1, fontSize: '9pt', color: '#666' }}>
                {`const contact = { email: "${data.personal?.email}", github: "${data.personal?.github}" };`}
            </Box>
        </Box>

        <Grid container spacing={3}>
            <Grid size={{ xs: 8 }}>
                {data.experience?.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ bgcolor: '#eee', display: 'inline-block', px: 1, mb: 1, fontSize: '11pt' }}>FUNCTION EXPERIENCE()</Typography>
                        {data.experience.map((exp, i) => (
                            <Box key={i} sx={{ mb: 2, pl: 2, borderLeft: `1px dashed #ccc` }}>
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '10.5pt' }}>{exp.role}</Typography>
                                <Typography variant="caption" sx={{ color: palette.primary, fontSize: '9pt' }}>@{exp.company} [{exp.startDate} - {exp.endDate}]</Typography>
                                <Typography variant="body2" sx={{ mt: 0.5, fontSize: '10pt', lineHeight: 1.4 }}>{exp.description}</Typography>
                            </Box>
                        ))}
                    </Box>
                )}

                {data.projects?.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ bgcolor: '#eee', display: 'inline-block', px: 1, mb: 1, fontSize: '11pt' }}>FUNCTION PROJECTS()</Typography>
                        {data.projects.map((proj, i) => (
                            <Box key={i} sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '10pt' }}>{proj.title}</Typography>
                                <Typography variant="body2" sx={{ fontSize: '9.5pt' }}>// {proj.description}</Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </Grid>
            <Grid size={{ xs: 4 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ bgcolor: '#eee', display: 'inline-block', px: 1, mb: 1, fontSize: '11pt' }}>ARRAY SKILLS</Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6, fontSize: '9.5pt' }}>
                        [{data.skills?.map(s => `"${s.name}"`).join(', ')}]
                    </Typography>
                </Box>

                {data.education?.length > 0 && (
                    <Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ bgcolor: '#eee', display: 'inline-block', px: 1, mb: 1, fontSize: '11pt' }}>OBJECT EDUCATION</Typography>
                        {data.education.map((edu, i) => (
                            <Box key={i} sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '10pt' }}>{edu.institution}</Typography>
                                <Typography variant="body2" sx={{ fontSize: '9.5pt' }}>{edu.degree}</Typography>
                                <Typography variant="caption" sx={{ fontSize: '9pt' }}>{edu.year}</Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </Grid>
        </Grid>
    </Box>
);

const PremiumExecutive = ({ data, palette, isPdf }) => (
    <Box sx={{ ...PAGE_STYLE, ...(isPdf && { boxShadow: 'none', margin: 0, border: 'none' }), padding: 0, fontFamily: '"Garamond", serif', color: '#1f2937' }}>
        <Box sx={{ bgcolor: palette.primary, height: 10, width: '100%' }} />
        <Box sx={{ px: 6, pt: 3, pb: 3, textAlign: 'center', borderBottom: `1px solid ${palette.secondary}` }}>
            <Typography variant="h3" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: '24pt' }}>{data.personal?.fullName}</Typography>
            <Typography variant="h6" sx={{ color: palette.text, mt: 0.5, fontWeight: 'normal', fontSize: '12pt' }}>{data.personal?.designation}</Typography>
            <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'center', gap: 4, fontSize: '10pt' }}>
                {data.personal?.email && <span>{data.personal.email}</span>}
                {data.personal?.phoneNumber && <span>{data.personal.phoneNumber}</span>}
                {data.personal?.linkedin && <span>LinkedIn</span>}
            </Box>
        </Box>

        <Box sx={{ p: 6 }}>
            {data.personal?.summary && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ borderBottom: '2px solid #e5e7eb', pb: 0.5, mb: 1, textTransform: 'uppercase', fontSize: '11pt', color: palette.text }}>Executive Profile</Typography>
                    <Typography variant="body1" lineHeight={1.5} sx={{ fontSize: '10.5pt' }}>{data.personal.summary}</Typography>
                </Box>
            )}

            <Grid container spacing={5}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ borderBottom: '2px solid #e5e7eb', pb: 0.5, mb: 2, textTransform: 'uppercase', fontSize: '11pt', color: palette.text }}>Professional Experience</Typography>
                    {data.experience?.map((exp, i) => (
                        <Box key={i} sx={{ mb: 3 }}>
                            <Grid container>
                                <Grid size={{ xs: 9 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '12pt' }}>{exp.company}</Typography>
                                    <Typography variant="subtitle1" sx={{ color: '#4b5563', fontStyle: 'italic', mb: 0.5, fontSize: '10.5pt' }}>{exp.role}</Typography>
                                </Grid>
                                <Grid size={{ xs: 3 }} textAlign="right">
                                    <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '10pt' }}>{exp.startDate} – {exp.endDate}</Typography>
                                </Grid>
                            </Grid>
                            <Typography variant="body2" sx={{ mt: 0.5, fontSize: '10.5pt', lineHeight: 1.4 }}>{exp.description}</Typography>
                        </Box>
                    ))}
                </Grid>
            </Grid>

            <Grid container spacing={5} sx={{ mt: 0 }}>
                <Grid size={{ xs: 6 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ borderBottom: '2px solid #e5e7eb', pb: 0.5, mb: 1, textTransform: 'uppercase', fontSize: '11pt', color: palette.text }}>Education</Typography>
                    {data.education?.map((edu, i) => (
                        <Box key={i} sx={{ mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '10.5pt' }}>{edu.institution}</Typography>
                            <Typography variant="body2" sx={{ fontSize: '10pt' }}>{edu.degree}, {edu.year}</Typography>
                        </Box>
                    ))}
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ borderBottom: '2px solid #e5e7eb', pb: 0.5, mb: 1, textTransform: 'uppercase', fontSize: '11pt', color: palette.text }}>Core Competencies</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {data.skills?.map((s, i) => (
                            <Typography key={i} variant="body2" sx={{ fontSize: '10pt' }}>{s.name} •</Typography>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    </Box>
);


// ==========================================
// MAIN COMPONENT & MAPPING
// ==========================================

export const TEMPLATE_MAP = {
    [TEMPLATE_IDS.ATS_CLASSIC]: AtsClassic,
    [TEMPLATE_IDS.ATS_MINIMAL]: AtsMinimal,
    [TEMPLATE_IDS.MODERN]: PremiumModern,
    [TEMPLATE_IDS.ELEGANT]: PremiumElegant,
    [TEMPLATE_IDS.CREATIVE]: PremiumCreative,
    [TEMPLATE_IDS.TECH]: PremiumTech,
    [TEMPLATE_IDS.EXECUTIVE]: PremiumExecutive,
};

const LivePreview = ({ data, templateId = TEMPLATE_IDS.MODERN, palette = 'blue' }) => {

    // Resolve Component
    const TemplateComponent = TEMPLATE_MAP[templateId] || PremiumModern;
    const activePalette = (typeof palette === 'string') ? (COLOR_PALETTES[palette] || COLOR_PALETTES.blue) : palette;

    const [scale, setScale] = useState(0.8);
    const containerRef = useRef(null);

    // Auto-scaling logic (Fit to Width)
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const parentWidth = containerRef.current.parentElement.offsetWidth;
                const availableWidth = parentWidth - 40;
                // A4 width in px logic: 210mm * 3.78
                const a4WidthPx = 794;

                let newScale = availableWidth / a4WidthPx;
                if (newScale > 1.2) newScale = 1.2;
                if (newScale < 0.3) newScale = 0.3;

                setScale(newScale);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        setTimeout(handleResize, 100);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Paper
            elevation={0}
            sx={{
                height: '100%',
                minHeight: '800px',
                borderRadius: 2,
                bgcolor: '#525659',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            {/* Toolbar */}
            <Box sx={{
                p: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2,
                bgcolor: 'white', borderBottom: '1px solid #ddd', zIndex: 10
            }}>
                <Typography variant="caption">Zoom:</Typography>
                <ZoomOutIcon fontSize="small" onClick={() => setScale(s => Math.max(0.3, s - 0.1))} sx={{ cursor: 'pointer' }} />
                <Slider
                    value={scale}
                    min={0.3} max={1.5} step={0.1}
                    onChange={(_, v) => setScale(v)}
                    sx={{ width: 100 }}
                />
                <ZoomInIcon fontSize="small" onClick={() => setScale(s => Math.min(1.5, s + 0.1))} sx={{ cursor: 'pointer' }} />
            </Box>

            {/* Scrollable Preview Area */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    pt: 4, pb: 4,
                    '&::-webkit-scrollbar': { width: '8px', height: '8px' },
                    '&::-webkit-scrollbar-thumb': { bgcolor: '#888', borderRadius: '4px' }
                }}
            >
                {/* Scaled Wrapper */}
                <div
                    ref={containerRef}
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'top center',
                        width: '210mm',
                    }}
                >
                    <TemplateComponent data={data} palette={activePalette} />
                </div>
            </Box>
        </Paper>
    );
};

export default LivePreview;
