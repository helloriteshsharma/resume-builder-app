package com.ampta.resume_api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Resume Builder Core API")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Shivam Gupta")
                                .email("timenakanu@gmail.com")
                                .url("www.linkedin.com/in/shivam77000"))
                        .description("REST API for creating, managing, and retrieving professional resumes"))
                        .tags(List.of(
                            new Tag().name("Resume Management").description("Manages all resume CRUD operations."),
                            new Tag().name("Authentication").description("Handles user login and registration.")
                        ));

    }
}
