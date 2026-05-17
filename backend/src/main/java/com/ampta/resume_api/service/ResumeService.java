package com.ampta.resume_api.service;

import com.ampta.resume_api.document.Resume;
import com.ampta.resume_api.dto.CreateResumeRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface ResumeService {
    Resume createResume(CreateResumeRequest request, Object principalObject);

    List<Resume> getUserResumes(Object principal);

    Resume getResumeById(String id, Object principal);

    Resume updateResume(String id, Resume updateData, Object principal);

    void deleteResume(String id, Object principal);
}
