import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const PageHeader = ({ title, subtitle, action, sx = {} }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, ...sx }}>
            <Box>
                <Typography
                    variant="h4"
                    fontWeight="800"
                    sx={{ mb: 1, color: '#1e293b' }}
                >
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="body1" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
            </Box>
            {action && (
                <Box>
                    {action}
                </Box>
            )}
        </Box>
    );
};

export default PageHeader;
