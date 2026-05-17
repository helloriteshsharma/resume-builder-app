package com.ampta.resume_api.service.impl;

import com.ampta.resume_api.document.Payment;
import com.ampta.resume_api.document.User;
import com.ampta.resume_api.dto.AuthResponse;
import com.ampta.resume_api.repository.PaymentRepository;
import com.ampta.resume_api.repository.UserRepository;
import com.ampta.resume_api.service.AuthService;
import com.ampta.resume_api.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.json.JsonObject;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import static com.ampta.resume_api.util.Endpoints.PREMIUM;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final AuthService authService;
    private final UserRepository userRepository;

    @Value( "${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Override
    public Payment createOrder(Object principal, String planType) throws RazorpayException {
        // step 0: Get authorized user
        AuthResponse authUser = authService.getProfile(principal);

        // step 1: Initialize the razorpay client
        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        // step 2: Prepare the json object to pass the razorpay
        int amount = 99900;
        String currency = "INR";
        String receipt = PREMIUM+ "_" + UUID.randomUUID().toString().substring(0, 8);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount);
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", receipt);

        // step 3: Call the razorpay API to create order
        Order razorpayOrder = razorpayClient.orders.create(orderRequest);

        // step 4: Save the order details
        Payment newPayment = Payment.builder()
                .userId(authUser.getId())
                .razorpayOrderId(razorpayOrder.get("id"))
                .amount(amount)
                .currency(currency)
                .planType(planType)
                .status("created")
                .receipt(receipt)
                .build();

        // step 5: Return the result
        return paymentRepository.save(newPayment);

    }

    @Override
    public boolean verifyPayment(String razorpayOrderId, String razorpayPaymentId, String razorPaySignature) throws RazorpayException {
        try{
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", razorpayOrderId);
            attributes.put("razorpay_payment_id", razorpayPaymentId);
            attributes.put("razorpay_signature", razorPaySignature);

            boolean isValidSignature = Utils.verifyPaymentSignature(attributes, razorpayKeySecret);

            if(isValidSignature){
                Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                        .orElseThrow(() -> new RuntimeException("Payment not found"));

                payment.setRazorpayPaymentId(razorpayPaymentId);
                payment.setRazorpaySignature(razorPaySignature);
                payment.setStatus("paid");
                paymentRepository.save(payment);

                // Upgrade the user subscription
                upgradeUserSubscription(payment.getUserId(), payment.getPlanType());
                return true;
            }
            return false;

        } catch (Exception e) {
            log.error("Error verifying the payment: ", e);
            return false;
        }

    }

    @Override
    public List<Payment> getUserPayments(Object principal) {
        // step 1: Get the current profile
        AuthResponse authUser = authService.getProfile(principal);

        // step 2: Call the repository finder method
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(authUser.getId());

    }

    @Override
    public Payment getPaymentDetails(String orderId) {
        // step 1: Call the repository finder method
        return paymentRepository.findByRazorpayOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

    }

    private void upgradeUserSubscription(String userId, String planType) {

        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        existingUser.setSubscriptionPlan(planType);
        userRepository.save(existingUser);
        log.info("User {} upgraded to {} plan", userId, planType);

    }
}
