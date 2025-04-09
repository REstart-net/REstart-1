# REstart LMS - Learning Management System

![REstart LMS Logo](https://media-hosting.imagekit.io//e60a0a3fac904c2a/WhatsApp_Image_2025-01-26_at_20.14.19-removebg-preview%20(3).png?Expires=1834242508&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=nVFdXSeeo14FtjV6G~ppAgawYVuWM5ZBFu3VmE~6EUH79Qe3QJ479US4D8pggGisa~3D5nKS0ICnJFBkwZyIV8iDLMX6LMTxPnoH9OkOnaYACbTTPgISyWVxr33MreB2LGvj0ePD5wi-weKMOaF-jYY9nr0AXGiYtUbOpCvRgws7RsDMKcTtO8xA~HP9Jim90PxyNhfp1842BWY~GDnlguAKH87V-Q-5RB8JJ6q~-wO9gX-ScIP26GqRVmXMQPmo4uuA6JH4fVvc1MjUKbBHtQBZ-3xFP0pAJax3I2lVLNX1EP2kHTpJuUTwwnLBCnkMNwst3BinXaixwg6I~kdkLw__)

## Overview

REstart LMS is a comprehensive Learning Management System designed to help students prepare for the NSAT (Newton School Aptitude Test) and technical interviews. The platform offers a personalized learning experience with adaptive content, progress tracking, and interactive resources.

## Features

### For NSAT Preparation
- **Subject-wise Learning**: Comprehensive materials for Basic Mathematics, Advanced Mathematics, English, and Logical Reasoning
- **Progress Tracking**: Monitor your progress across all subjects with detailed analytics
- **Mock Tests**: Practice with full-length mock tests to assess your preparation level
- **Study Time Tracking**: Track your study hours and maintain streaks
- **Certificates**: Earn certificates upon completing modules and tests

### For Interview Preparation
- **Technical Interview Prep**: Resources for DSA, System Design, and technical concepts
- **Mock Interviews**: Schedule and participate in mock interviews with expert feedback
- **Soft Skills Training**: Improve communication and presentation skills
- **Interview Resources**: Access curated materials for interview preparation
- **Progress Dashboard**: Track your interview preparation progress

### General Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **User Authentication**: Secure login and registration system
- **Referral Program**: Share your referral link to get NSAT exam for free
- **Premium Packages**: Access to additional features with premium and ultimate packages

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Routing**: Wouter
- **Authentication**: Supabase Auth
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/restart-lms.git
   cd restart-lms
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   └── ...             # Custom components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
├── pages/              # Page components
├── shared/             # Shared constants and types
└── App.tsx             # Main application component
```

## Key Components

### Dashboard
The dashboard provides a personalized view based on the user's needs:
- For NSAT preparation: Shows subject progress, upcoming exams, and study statistics
- For interview preparation: Displays interview prep progress, upcoming mock interviews, and resources

### Authentication
Secure user authentication with email/password and social login options.

### Interview Booking
Users can schedule mock interviews with expert interviewers, select preferred dates and time slots.

### Resources
Access to comprehensive learning materials, practice questions, and interview preparation guides.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide](https://lucide.dev/) for the icons
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Supabase](https://supabase.io/) for authentication and database

## Contact

For any queries or support, please contact:
- Email: support@restartlms.com
- Website: [www.restartlms.com](https://www.restartlms.com) 
