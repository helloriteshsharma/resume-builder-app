package com.ampta.resume_api.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface FileUploadService {

    Map<String, String> uploadSingleImage(MultipartFile file) throws IOException;

    Map<String, String> uploadResumeImages(String id, Object principal, MultipartFile thumbnail, MultipartFile profileImage) throws IOException;
}
