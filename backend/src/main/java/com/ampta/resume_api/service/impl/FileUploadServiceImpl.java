package com.ampta.resume_api.service.impl;

import com.ampta.resume_api.document.Resume;
import com.ampta.resume_api.dto.AuthResponse;
import com.ampta.resume_api.repository.ResumeRepository;
import com.ampta.resume_api.service.AuthService;
import com.ampta.resume_api.service.FileUploadService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileUploadServiceImpl implements FileUploadService {
    private final Cloudinary cloudinary;
    private final AuthService authService;
    private final ResumeRepository resumeRepository;

    public Map<String, String> uploadSingleImage(MultipartFile file) throws IOException {

        Map<String, Object> imageUploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("resource_type", "image"));
        return Map.of("imageUrl", imageUploadResult.get("secure_url").toString());
    }

    @Override
    public Map<String, String> uploadResumeImages(String resumeId,
                                                  Object principal,
                                                  MultipartFile thumbnail,
                                                  MultipartFile profileImage) throws IOException {
        // step 1: Get the current profile
        AuthResponse authUser = authService.getProfile(principal);

        // step 2: Get the existing resume
        Resume existingResume = resumeRepository.findByUserIdAndId(authUser.getId(), resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        // step 3: Upload the resume images and set the resume
        Map<String, String> response = new HashMap<>();
        Map<String, String> result;

        if(Objects.nonNull(thumbnail)){
            result = uploadSingleImage(thumbnail);
            existingResume.setThumbnailLink(result.get("imageUrl"));
            response.put("thumbnailLink", result.get("imageUrl"));
        }

        if(Objects.nonNull(profileImage)){
            result = uploadSingleImage(profileImage);
            if(Objects.isNull(existingResume.getProfileInfo())){
                existingResume.setProfileInfo(new Resume.ProfileInfo());
            }
            existingResume.getProfileInfo().setProfilePreviewUrl(result.get("imageUrl"));
            response.put("profilePreviewUrl", result.get("imageUrl"));
        }

        // step 4: Update the details into database
        resumeRepository.save(existingResume);
        response.put("message", "Images uploaded successfully");

        // step 5: return the result
        return response;
    }
}
