package com.ampta.resume_api.service;

import java.util.Map;

public interface TemplateService {

    Map<String, Object> getTemplates(Object principal);
}
