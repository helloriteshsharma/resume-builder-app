package com.ampta.resume_api.controller;

import com.ampta.resume_api.document.Payment;
import com.ampta.resume_api.service.PaymentService;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import static com.ampta.resume_api.util.Endpoints.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping(PAYMENT_CONTROLLER)
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping(CREATE_ORDER)
    public ResponseEntity<?> createOrder(@RequestBody Map<String, String> request,
                                         Authentication authentication) throws RazorpayException {
        // step 0: Validate the request
        String planType = request.get("planType");

        if(!PREMIUM.equalsIgnoreCase(planType)){
            return ResponseEntity.badRequest().body(Map.of("message ", "Invalid plan type"));
        }

        // step 1: Call the service method
        Payment payment = paymentService.createOrder(authentication.getPrincipal(), planType);

        // step 2: Prepare the response object
        Map<String, Object> response = Map.of(
                "orderId", payment.getRazorpayOrderId(),
                "amount", payment.getAmount(),
                "currency", payment.getCurrency(),
                "receipt", payment.getReceipt()
        );

        // step 3: Return the response
        return ResponseEntity.ok(response);

    }

    @PostMapping(VERIFY)
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) throws RazorpayException {
        // step 1: Validate the request
        String razorpayOrderId = request.get("razorpay_order_id");
        String razorpayPaymentId = request.get("razorpay_payment_id");
        String razorpaySignature = request.get("razorpay_signature");

        if(Objects.isNull(razorpayOrderId) || Objects.isNull(razorpayPaymentId) || Objects.isNull(razorpaySignature)){
            return ResponseEntity.badRequest().body(Map.of("message", "Missing required payment parameters"));
        }

        // step 2: Call the service method to verify the payment
        boolean isValid =  paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);

        // step 3: Return the response
        if(isValid){
            return ResponseEntity.ok(Map.of(
                    "message", "Payment verified successfully.",
                    "status", "Success"
            ));
        }else {
            return ResponseEntity.badRequest().body(Map.of("message", "Payment verification failed"));
        }
    }

    @GetMapping(HISTORY)
    public ResponseEntity<?> getPaymentHistory(Authentication authentication){

        // step 1: Call the service method
        List<Payment> payments = paymentService.getUserPayments(authentication.getPrincipal());

        // step 2: return the response
        return ResponseEntity.ok(payments);

    }

    @GetMapping(ORDER_ID)
    public ResponseEntity<?> getOrderDetails(@PathVariable String orderId){

        // step 1: Call the service method
        Payment payment = paymentService.getPaymentDetails(orderId);

        // step 2: return the response
        return ResponseEntity.ok(payment);

    }



}
