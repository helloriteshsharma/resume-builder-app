package com.ampta.resume_api.service.impl;

import com.ampta.resume_api.document.User;
import com.ampta.resume_api.dto.AuthResponse;
import com.ampta.resume_api.service.AuthService;
import com.ampta.resume_api.service.TemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.ampta.resume_api.util.Endpoints.PREMIUM;

@Service
@RequiredArgsConstructor
@Slf4j
public class TemplateServiceImpl implements TemplateService {

    private final AuthService authService;

    @Override
    public Map<String, Object> getTemplates(Object principal) {
        // step 1: Get the current profile
        AuthResponse authUser = authService.getProfile(principal);

        // step 2: Get the available template based on subscription
        List<String> availableTemplate;

        Boolean isPremium = PREMIUM.equalsIgnoreCase(authUser.getSubscriptionPlan());

        if(isPremium){
            availableTemplate = List.of("01", "02", "03");
        }else{
            availableTemplate = List.of("01");
        }
        // step 3: Add the data into Map
        Map<String, Object> restrictions = new HashMap<>();
        restrictions.put("availableTemplates", availableTemplate);
        restrictions.put("allTemplates", List.of("01", "02", "03"));
        restrictions.put("subscriptionPlan", authUser.getSubscriptionPlan());
        restrictions.put("isPremium", isPremium);

        // step 4: Return the result
        return  restrictions;
    }
}
