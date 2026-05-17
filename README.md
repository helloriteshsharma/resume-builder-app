# 📄 Resume Builder Project

Welcome! This is a comprehensive web application for building and managing professional resumes. It allows users to register, create resumes, and export them in various formats.

This guide is designed to help you set up and run the project easily, even if you are new to some of these technologies.

---

## Website Images

<img width="1162" height="869" alt="resume_login_page" src="https://github.com/user-attachments/assets/4dc8d8c2-c7f9-4de4-9121-cfc6108cf693" />
<img width="1607" height="869" alt="localhost_5173_dashboard" src="https://github.com/user-attachments/assets/3afdc3ca-4b14-4986-86a4-7bbeab79b517" />
<img width="1607" height="869" alt="localhost_5173_templates" src="https://github.com/user-attachments/assets/7ebd9980-d33e-4a8d-bca9-e157f3d035d8" />
<img width="1607" height="869" alt="localhost_5173_editor" src="https://github.com/user-attachments/assets/e817c434-ad75-4d1f-91c5-a1e2496d0705" />
<img width="1607" height="869" alt="local_choose_templates" src="https://github.com/user-attachments/assets/d0c34a73-20b0-47f7-b389-94790b003856" />
<img width="1607" height="869" alt="send_resume" src="https://github.com/user-attachments/assets/cd7590a9-9c2d-41c6-bd31-1c0ec1a494ad" />


## 🏗️ Tech Stack

This project is built using modern, industry-standard technologies:

*   **Backend (Server)**: Java 21 with Spring Boot (handles logic, database, and authentication).
*   **Frontend (User Interface)**: React 19 with Vite (fast, interactive web pages).
*   **Database**: MongoDB (stores user data and resumes).
*   **Containerization**: Docker (helps run everything together easily).

---

## 🚀 How to Run the Project (The Easy Way)

The easiest way to run this project is using **Docker**. Docker allows you to run the entire application (Backend, Frontend, and Database) with just a single command, without needing to install Java or Node.js on your computer.

### Prerequisites

Before you start, make sure you have the following installed:

1.  **Git**: To download the code. [Download Git](https://git-scm.com/downloads)
2.  **Docker Desktop**: To run the application containers. [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
    *   *Note: After installing Docker Desktop, make sure it is running.*

### Step-by-Step Guide

#### 1. Clone the Repository
Open your terminal (Command Prompt, PowerShell, or Terminal) and run:

```bash
git clone <repository-url>
cd resume-api
```
*(Replace `<repository-url>` with the actual link to your GitHub repository)*

#### 2. Configure Environment Variables
The application needs some secret keys to work (like database passwords and API keys). You need to create a file named `.env` in the root folder (`resume-api/`) and add the following values.

**Create a file named `.env` and paste this content:**

```env
# Database Configuration (Docker handles this automatically usually, but good to have)
SPRING_DATA_MONGODB_URI=mongodb://mongo:27017/resume-api

# Mail Configuration (For sending emails)
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your_email@gmail.com
SPRING_MAIL_PASSWORD=your_app_password
SPRING_MAIL_FROM=your_email@gmail.com

# Cloudinary (For image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (For payments)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

> **Tip:** You will need to sign up for Cloudinary and Razorpay (or use test credentials) to fill in those values. For Gmail, you need an "App Password" if you have 2FA enabled.

#### 3. Run with Docker
Now for the magic part! Run this command in your terminal:

```bash
docker-compose up --build
```

**What is happening?**
*   `docker-compose` is orchestrating the startup.
*   `up` tells it to start the services.
*   `--build` tells it to rebuild the images if code changed (good practice).

You will see a lot of text scrolling. Wait until you see messages indicating the backend has started (e.g., "Started ResumeApiApplication").

#### 4. Access the Application

Once the logs settle down, open your browser and visit:

*   **Frontend (The App)**: [http://localhost:5173](http://localhost:5173)
*   **Backend API Documentation (Swagger)**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) (Great for testing API endpoints directly!)

---

## 🛠️ Troubleshooting

*   **"Port already in use"**: If you see this error, make sure you don't have other apps running on ports `8080` (Backend) or `5173` (Frontend) or `27017` (MongoDB).
*   **Database connection failed**: Ensure the `mongo` service in Docker is running. Docker Compose usually handles this, but sometimes restarts depend on it.
*   **Changes not showing?**: If you change the code, stop the app with `Ctrl+C` and run `docker-compose up --build` again.

---

## 📚 For Developers (Manual Setup)

If you prefer to run things manually (without Docker), you will need:
*   Java 21 JDK
*   Maven
*   Node.js & npm
*   MongoDB running locally

**1. Backend:**
```bash
mvn spring-boot:run
```

**2. Frontend:**
```bash
cd frontend
npm install
npm run dev
```
