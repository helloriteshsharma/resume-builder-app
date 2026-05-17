package com.ampta.resume_api.service;

import com.ampta.resume_api.dto.AuthResponse;
import com.ampta.resume_api.dto.LoginRequest;
import com.ampta.resume_api.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    void verifyEmail(String token);

    AuthResponse login(LoginRequest request);

    void resendVerification(String email);

    AuthResponse getProfile(Object principalObject);

    AuthResponse updateProfile(Object principalObject, com.ampta.resume_api.dto.UpdateProfileRequest request);
}
