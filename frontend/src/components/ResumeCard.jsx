import React from 'react';
import { Card, CardContent, CardActions, Typography, Box, Button, IconButton, Chip, Tooltip, Divider } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, AccessTime as AccessTimeIcon } from '@mui/icons-material';
import LivePreview, { TEMPLATE_IDS } from './LivePreview';

const ResumeCard = ({
    title,
    updatedAt,
    templateId,
    palette,
    data,
    onEdit,
    onDelete,
    onSelect,
    isTemplate = false,
    isPremium = false,
    description,
    style // Accept style prop from parent Grid
}) => {

    const safeTemplateId = templateId || TEMPLATE_IDS.MODERN;
    const safePalette = palette || 'blue';

    return (
        <Card
            elevation={0}
            onClick={onEdit || onSelect}
            style={style} // Apply parent styles (width/height)
            sx={{
                height: '100%',
                width: '100%', // Force full width
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                bgcolor: 'white',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px -10px rgba(0, 0, 0, 0.1)',
                    borderColor: '#cbd5e1'
                }
            }}
        >
            {/* Thumbnail Area - Reduced height for better balance */}
            <Box
                sx={{
                    height: 250, // Reduced from 320 to give text more space
                    bgcolor: '#f1f5f9',
                    overflow: 'hidden',
                    position: 'relative',
                    borderBottom: '1px solid #e2e8f0'
                }}
            >
                {/* Scaled Preview */}
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%) scale(0.35)', // Slightly smaller scale to fit new height
                    transformOrigin: 'top center',
                    width: '210mm',
                    minHeight: '297mm',
                    pt: 4,
                    pointerEvents: 'none'
                }}>
                    <LivePreview data={data} templateId={safeTemplateId} palette={safePalette} />
                </Box>

                {/* Hover Overlay */}
                <Box sx={{
                    position: 'absolute', inset: 0,
                    bgcolor: 'rgba(0,0,0,0)',
                    transition: '0.2s',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' }
                }} />
            </Box>

            {/* Content Area - Now a Flex Column to distribute space */}
            <CardContent sx={{
                flexGrow: 1,
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between' // Pushes elements apart if card stretches
            }}>
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" fontWeight="700" noWrap title={title} sx={{ fontSize: '1.1rem', color: '#1e293b' }}>
                            {title}
                        </Typography>
                        {isTemplate && isPremium && (
                            <Chip label="PRO" size="small" color="warning" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold', borderRadius: 1 }} />
                        )}
                    </Box>

                    {/* Description / Date Area */}
                    {isTemplate ? (
                        <Typography variant="body2" color="text.secondary" sx={{
                            lineHeight: 1.6,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3, // Allow 3 lines of text
                            WebkitBoxOrient: 'vertical'
                        }}>
                            {description}
                        </Typography>
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                            Updated {updatedAt ? new Date(updatedAt).toLocaleDateString() : 'Just now'}
                        </Typography>
                    )}
                </Box>
            </CardContent>

            <Divider sx={{ borderColor: '#f1f5f9' }} />

            {/* Actions Area - Pinned to bottom */}
            <CardActions sx={{ p: 2, bgcolor: '#fff', justifyContent: 'space-between' }}>
                {isTemplate ? (
                    <Button
                        variant="contained"
                        fullWidth
                        disableElevation
                        onClick={onSelect}
                        sx={{ textTransform: 'none', fontWeight: 'bold', py: 1 }}
                    >
                        Use Template
                    </Button>
                ) : (
                    <>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={onEdit}
                            sx={{
                                textTransform: 'none',
                                fontWeight: '600',
                                flexGrow: 1,
                                mr: 1,
                                borderColor: '#e2e8f0',
                                color: '#475569'
                            }}
                        >
                            Edit
                        </Button>
                        <Tooltip title="Delete Resume">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={onDelete}
                                sx={{ bgcolor: '#fff1f2', border: '1px solid #fecdd3', '&:hover': { bgcolor: '#ffe4e6' } }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </CardActions>
        </Card>
    );
};

export default ResumeCard;