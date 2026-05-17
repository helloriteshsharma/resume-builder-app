package com.ampta.resume_api.service;

import jakarta.mail.MessagingException;

public interface EmailService {

    void sendHtmlEmail(String toEmail, String subject, String htmlContent) throws MessagingException;

    void sendEmailWithAttachment(String toEmail, String subject, String body, byte[] attachment, String filename) throws MessagingException;
}
