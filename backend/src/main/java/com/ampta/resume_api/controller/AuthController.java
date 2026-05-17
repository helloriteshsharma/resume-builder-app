package com.ampta.resume_api.controller;

import com.ampta.resume_api.document.User;
import com.ampta.resume_api.dto.AuthResponse;
import com.ampta.resume_api.dto.LoginRequest;
import com.ampta.resume_api.dto.RegisterRequest;
import com.ampta.resume_api.service.AuthService;
import com.ampta.resume_api.service.FileUploadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;

import static com.ampta.resume_api.util.Endpoints.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping(AUTH_CONTROLLER)
public class AuthController {

    private final AuthService authService;
    private final FileUploadService fileUploadService;

    @PostMapping(REGISTER)
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {

        log.info("Register request received: {}", request);

        AuthResponse response = authService.register(request);

        log.info("Returning from Register controller Response: {}", response);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }

    @GetMapping(VERIFY_EMAIL)
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {

        log.info("Verify email request received: {}", token);

        authService.verifyEmail(token);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "Email verified successfully."));
    }

    @PostMapping(UPLOAD_IMAGE)
    public ResponseEntity<?> uploadImage(@RequestPart("image") MultipartFile file) throws IOException {
        log.info("Upload image request received");

        Map<String, String> response = fileUploadService.uploadSingleImage(file);
        return ResponseEntity.ok(response);
    }

    @PostMapping(LOGIN)
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping(RESEND_VERIFICATION)
    public ResponseEntity<?> resendVerification(@RequestBody Map<String, String> body) {
        // step 1: Get the email from the request
        String email = body.get("email");

        // step 2: Add the validations
        if (Objects.isNull(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }

        // step 3: Call the service method to resend verification code
        authService.resendVerification(email);

        // step 4: Returns response
        return ResponseEntity.ok(Map.of("success", "true", "message", "Verification email sent"));
    }

    @GetMapping(PROFILE)
    public ResponseEntity<?> getProfile(Authentication authentication) {
        // step 1: Get the principal object
        Object principalObject = authentication.getPrincipal();

        // step 2: Call the service method
        AuthResponse currentProfile = authService.getProfile(principalObject);

        // step 3: return the response
        return ResponseEntity.ok(currentProfile);

    }

    @PutMapping(PROFILE)
    public ResponseEntity<?> updateProfile(Authentication authentication,
            @RequestBody com.ampta.resume_api.dto.UpdateProfileRequest request) {
        Object principalObject = authentication.getPrincipal();
        AuthResponse updatedProfile = authService.updateProfile(principalObject, request);
        return ResponseEntity.ok(updatedProfile);
    }

}
