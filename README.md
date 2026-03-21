# Skill Swap Platform 🎯

A web application enabling peer-to-peer skill exchange. Users can list skills they offer, browse others’ profiles, and request skill swaps.


# Project Presentation : https://www.canva.com/design/DAGs7fg4gYg/MJTZK18Y3r-0xZ9gemlbIA/edit?utm_content=DAGs7fg4gYg&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton


## Table of Contents

* [Problem Statement](#problem-statement)
* [Team Members](#team-members)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Installation](#installation)
* [Usage](#usage)
* [Project Structure](#project-structure)
* [API Endpoints](#api-endpoints)
* [Testing](#testing)
* [Contributing](#contributing)
* [License](#license)

## Problem Statement 🔍

Develop a Skill Swap Platform — a mini application that enables users to list their skills and request others in return. Users can:

* List skills they offer and skills they want
* Set their profile to public or private
* Browse and search by skill and availability
* Send, accept, reject, or cancel swap requests
* Rate and review completed swaps

## Team Members 👥

* Yash Gupta(Team Leader)  --  gyash6991@gmail.com
* Aastha Kumari --  aiml.aastha.2006@gmail.com
* Shriyam Chaudhary -- shriyamchaudhary801@gmail.com
* Abhishek Aryan --  abhi.aryan021@gmail.com

## Features ✨

* User registration and authentication
* Profile management (name, location, photo, visibility)
* Skill listing and search/filter functionality
* Swap request lifecycle (send, accept, reject, cancel)
* Rating and review system for completed swaps
* Responsive design for desktop and mobile

## Tech Stack 🛠️

* Frontend: React, Tailwind CSS
* Backend: Node.js, Express
* Database: MongoDb Atlas
* Testing: Postman Api Testing

## Installation ⚙️

1. Clone the repository:

  
   git clone <YOUR_REPO_URL>
   cd skill-swap-platform
   
2. Install dependencies:

  
   npm install
   
4. Initialize the database (run migrations or SQL scripts).
5. Start the backend server:

  
   npm run start:backend
   
6. Start the frontend development server:

  
   npm run start:frontend
   
## Usage ▶️

1. Register a new user and log in
2. Complete your profile by adding skills and availability
3. Browse or search for users by skill
4. Send a swap request with an optional message
5. Manage requests in your dashboard: accept, reject, or cancel
6. Rate and review your swap partner after completion

## Project Structure 📂

# Backend Structure

skill-swap-Platform/
│
├── controllers/
│   ├── user.controller.js
│   ├── auth.controller.js
│   ├── skill.controller.js
│   ├── swap.controller.js
│   └── admin.controller.js
│
├── models/
│   ├── user.model.js
│   ├── skill.model.js
│   ├── swap.model.js
│   ├── feedback.model.js
│   └── adminActivity.model.js
│
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── skill.routes.js
│   ├── swap.routes.js
│   └── admin.routes.js
│
├── middlewares/
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   ├── errorHandler.js
│   └── validate.middleware.js
│
├── utils/
│   ├── logger.js
│   ├── emailService.js
│   └── reportGenerator.js
│
├── config/
│   └── db.js
│
├── .env
├── server.js
└── package.json

# Frontend Structure 

skill-swap-frontend/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   └── avatar.jpeg             # Static images or icons
│
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProtectedRoute.jsx  # For private route protection
│   │   ├── DummyUser.jsx
│   │   └── SwapCard.jsx            # Example UI card for swap requests
│
│   ├── pages/
│   │   ├── HomePage.jsx            # /
│   │   ├── Login.jsx               # /login
│   │   ├── Register.jsx            # /register
│   │   ├── UserProfile.jsx         # /userprofile
│   │   ├── UserProfilePreview.jsx  # /login/user
│   │   └── SendSwapRequest.jsx     # /login/userrequest
│
│   ├── api/
│   │   └── axiosInstance.js        # Axios baseURL & interceptors
│
│   ├── context/
│   │   └── AuthContext.js          # Manage user login state globally
│
│   ├── routes/
│   │   └── AppRoutes.jsx           # Centralized React Router routes
│
│   ├── App.jsx
│   ├── index.js
│   └── index.css                   # Tailwind CSS config file
│
├── .env                            # REACT_APP_API_URL
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md



## API Endpoints 🔗

### Authentication

* POST /api/auth/signup — Register a new user
* POST /api/auth/login — Log in and receive a token

### Users

* GET /api/users — List users with optional filters
* GET /api/users/:id — Get user profile
* PATCH /api/users/:id — Update profile settings



## Testing 🧪

* Postman Api Testing

 
  npm test
  
* Run Cypress end-to-end tests:

 
  npx cypress open
  
## Contributing 🤝

Contributions are welcome! Please open an issue or submit a pull request.

