package com.ampta.resume_api.controller;

import com.ampta.resume_api.service.TemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import static com.ampta.resume_api.util.Endpoints.TEMPLATE_CONTROLLER;

@RestController
@RequiredArgsConstructor
@RequestMapping(TEMPLATE_CONTROLLER)
@Slf4j
public class TemplateController {

    private final TemplateService templateService;

    @GetMapping
    public ResponseEntity<?> getTemplates(Authentication authentication){
        // step 1: Call the service method
        Map<String, Object> response = templateService.getTemplates(authentication.getPrincipal());

        // step 2: Return the response
        return ResponseEntity.ok(response);
    }
}
