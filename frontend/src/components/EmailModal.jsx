import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    Alert
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const EmailModal = ({ open, onClose, onSend, sending }) => {
    const [recipientEmail, setRecipientEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!recipientEmail) {
            setError('Recipient email is required');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
            setError('Invalid email address');
            return;
        }

        onSend({ recipientEmail, subject, message });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Send Resume via Email</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 1 }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <TextField
                        autoFocus
                        margin="dense"
                        label="Recipient Email"
                        type="email"
                        fullWidth
                        required
                        value={recipientEmail}
                        onChange={(e) => {
                            setRecipientEmail(e.target.value);
                            setError('');
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="Subject (Optional)"
                        type="text"
                        fullWidth
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Resume Application"
                    />
                    <TextField
                        margin="dense"
                        label="Message (Optional)"
                        multiline
                        rows={4}
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please find my resume attached..."
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={sending}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    endIcon={<SendIcon />}
                    disabled={sending}
                >
                    {sending ? 'Sending...' : 'Send Email'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EmailModal;
