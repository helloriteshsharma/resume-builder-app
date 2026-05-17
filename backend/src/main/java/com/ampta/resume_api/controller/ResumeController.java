package com.ampta.resume_api.controller;

import com.ampta.resume_api.document.Resume;
import com.ampta.resume_api.dto.CreateResumeRequest;
import com.ampta.resume_api.service.FileUploadService;
import com.ampta.resume_api.service.ResumeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import static com.ampta.resume_api.util.Endpoints.*;

@RestController
@RequestMapping(RESUME_CONTROLLER)
@RequiredArgsConstructor
@Slf4j
public class ResumeController {

    private final ResumeService resumeService;
    private final FileUploadService fileUploadService;

    @PostMapping
    public ResponseEntity<?> createResume(@Valid @RequestBody CreateResumeRequest request,
                                          Authentication authentication){

        log.info("ResumeController: Request to create a new resume for user: {}", authentication.getName());
        // step 1: Call the service method
        Resume newResume = resumeService.createResume(request, authentication.getPrincipal());

        // step 2: return the response
        log.info("ResumeController: Successfully created a new resume with ID: {}", newResume.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(newResume);

    }

    @GetMapping
    public ResponseEntity<?> getUserResumes(Authentication authentication){
        log.info("ResumeController: Request to fetch all resumes for user: {}", authentication.getName());
        // step 1: Call the service method
        List<Resume> resumes = resumeService.getUserResumes(authentication.getPrincipal());

        log.info("ResumeController: Successfully fetched {} resumes for user: {}", resumes.size(), authentication.getName());
        // step 2: return the response
        return ResponseEntity.ok(resumes);
    }

    @GetMapping(ID)
    public ResponseEntity<?> getResumeById(@PathVariable String id,
                                           Authentication authentication){
        log.info("ResumeController: Request to fetch resume with ID: {} for user: {}", id, authentication.getName());
        // step 1: Call the service method
        Resume resume = resumeService.getResumeById(id, authentication.getPrincipal());

        log.info("ResumeController: Successfully fetched resume with ID: {}", id);
        // step 2: return the response
        return ResponseEntity.ok(resume);
    }

    @PutMapping(ID)
    public ResponseEntity<?> updateResume(@PathVariable String id,
                                          @RequestBody Resume updateData,
                                          Authentication authentication){
        log.info("ResumeController: Request to update resume with ID: {} for user: {}", id, authentication.getName());
        // step 1: Call the service method
        Resume updatedResume = resumeService.updateResume(id, updateData, authentication.getPrincipal());

        log.info("ResumeController: Successfully updated resume with ID: {}", id);
        // step 2: return the response
        return ResponseEntity.ok(updatedResume);
    }

    @PutMapping(UPLOAD_IMAGES)
    public ResponseEntity<?> uploadResumeImages(
            @PathVariable String id,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            Authentication authentication) throws IOException {

        log.info("ResumeController: Request to upload images for resume with ID: {} by user: {}", id, authentication.getName());
        // step 1: Call the service method
        Map<String, String> response = fileUploadService.uploadResumeImages(id, authentication.getPrincipal(), thumbnail, profileImage);

        log.info("ResumeController: Successfully uploaded images for resume with ID: {}", id);
        // step 2: return the response
        return ResponseEntity.ok(response);
    }

    @DeleteMapping(ID)
    public ResponseEntity<?> deleteResume(@PathVariable String id,
                                          Authentication authentication){
        log.info("ResumeController: Request to delete resume with ID: {} for user: {}", id, authentication.getName());
        // step 1: Call the service method
        resumeService.deleteResume(id, authentication.getPrincipal());

        log.info("ResumeController: Successfully deleted resume with ID: {}", id);
        // step 2: Return the response
        return ResponseEntity.ok(Map.of("message", "Resume deleted successfully"));
    }

}
