package com.ampta.resume_api.service.impl;

import com.ampta.resume_api.document.Resume;
import com.ampta.resume_api.dto.AuthResponse;
import com.ampta.resume_api.dto.CreateResumeRequest;
import com.ampta.resume_api.repository.ResumeRepository;
import com.ampta.resume_api.service.AuthService;
import com.ampta.resume_api.service.ResumeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeServiceImpl implements ResumeService {

    @Override
    public void deleteResume(String resumeId, Object principal) {
        // step 1: Get the current profile
        AuthResponse authUser = authService.getProfile(principal);

        // step 2: Call the repository finder method and delete
        Resume existingResume = resumeRepository.findByUserIdAndId(authUser.getId(), resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        resumeRepository.delete(existingResume);

    }

    private final ResumeRepository resumeRepository;
    private final AuthService authService;

    @Override
    public Resume createResume(CreateResumeRequest request, Object principalObject) {

        log.info("ResumeService: Starting resume creation process.");
        // step 1: Create Resume object
        Resume newResume = new Resume();

        // step 2: Get the current profile
        AuthResponse authUser = authService.getProfile(principalObject);

        // step 3: Update the resume object
        newResume.setUserId(authUser.getId());
        newResume.setTitle(request.getTitle());

        // step 4: Set default data for resume
        setDefaultResumeData(newResume);
        // step 5: save the resume data
        return resumeRepository.save(newResume);
    }

    @Override
    public List<Resume> getUserResumes(Object principal) {
        // step 1: Get the current profile
        AuthResponse authUser = authService.getProfile(principal);

        // step 2: Call the repository finder method
        List<Resume> existingResumes = resumeRepository.findByUserIdOrderByUpdatedAtDesc(authUser.getId());

        // step 3: return the response
        return existingResumes;
    }

    @Override
    public Resume getResumeById(String resumeId, Object principal) {
        // step 1: Get the current profile
        AuthResponse authUser = authService.getProfile(principal);

        // step 2: Call the repository finder method
        Resume existingResume = resumeRepository.findByUserIdAndId(authUser.getId(), resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        // step 3: return the response
        return existingResume;
    }

    @Override
    public Resume updateResume(String resumeId, Resume updateData, Object principal) {
        // step 1: Get the current profile
        AuthResponse authUser = authService.getProfile(principal);

        // step 2: Call the repository finder method
        Resume existingResume = resumeRepository.findByUserIdAndId(authUser.getId(), resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        // step 3: Update the new data
        existingResume.setTitle(updateData.getTitle());
        existingResume.setThumbnailLink(updateData.getThumbnailLink());
        existingResume.setTemplate(updateData.getTemplate());
        existingResume.setProfileInfo(updateData.getProfileInfo());
        existingResume.setContactInfo(updateData.getContactInfo());
        existingResume.setWorkExperiences(updateData.getWorkExperiences());
        existingResume.setEducations(updateData.getEducations());
        existingResume.setSkills(updateData.getSkills());
        existingResume.setProjects(updateData.getProjects());
        existingResume.setCertifications(updateData.getCertifications());
        existingResume.setLanguages(updateData.getLanguages());
        existingResume.setInterests(updateData.getInterests());

        // step 4: Update the details into database
        resumeRepository.save(existingResume);

        // step 5: return result
        return existingResume;
    }


    private void setDefaultResumeData(Resume newResume) {
        newResume.setProfileInfo(new Resume.ProfileInfo());
        newResume.setContactInfo(new Resume.ContactInfo());
        newResume.setWorkExperiences(new ArrayList<>());
        newResume.setEducations(new ArrayList<>());
        newResume.setSkills(new ArrayList<>());
        newResume.setProjects(new ArrayList<>());
        newResume.setCertifications(new ArrayList<>());
        newResume.setLanguages(new ArrayList<>());
        newResume.setInterests(new ArrayList<>());
    }
}
