import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CircularProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const benefits = [
    "Unlimited Premium Templates",
    "AI-Powered Content Suggestions",
    "Priority Support",
    "Export to PDF & Word"
];

const PaymentModal = ({ open, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth(); // Ideally we'd refresh user here

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            // 1. Create Order on Backend
            const orderRes = await authService.createOrder("premium");
            const { orderId, amount, currency, key } = orderRes.data;

            // 2. Open Razorpay Checkout
            // Note: In real app, key should come from backend or env
            // Using a test key placeholder if not provided by backend
            const options = {
                key: key || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_RgmSc7seiCQOCh",
                amount: amount,
                currency: currency,
                name: "Resume API Premium",
                description: "Upgrade to Premium Plan",
                order_id: orderId,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        await authService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        onSuccess();
                        onClose();
                        alert("Upgrade Successful! Welcome to Premium.");
                        window.location.reload(); // Quick way to refresh user state
                    } catch (verifyError) {
                        console.error("Payment verification failed", verifyError);
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: {
                    color: "#6366f1"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Failed to initiate payment", error);
            alert("Failed to start payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Box sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', p: 3, color: 'white' }}>
                <Typography variant="h5" fontWeight="bold">Unlock Premium Power</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Upgrade now to access exclusive features.</Typography>
            </Box>
            <DialogContent sx={{ p: 3 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h3" fontWeight="bold" color="primary">₹499</Typography>
                    <Typography color="text.secondary">One-time payment</Typography>
                </Box>
                <List>
                    {benefits.map((text) => (
                        <ListItem key={text} disablePadding sx={{ mb: 1 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                <CheckCircleIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleUpgrade}
                    disabled={loading}
                    size="large"
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Upgrade Now"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PaymentModal;
