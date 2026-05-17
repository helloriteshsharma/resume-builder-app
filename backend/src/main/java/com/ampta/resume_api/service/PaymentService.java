package com.ampta.resume_api.service;

import com.ampta.resume_api.document.Payment;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;


public interface PaymentService {
    Payment createOrder(Object principal, String planType) throws RazorpayException;

    boolean verifyPayment(String razorpayOrderId, String razorpayPaymentId, String razorPaySignature) throws RazorpayException;

    List<Payment> getUserPayments(Object principal);

    Payment getPaymentDetails(String orderId);
}
