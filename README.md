# LeetCode Weekly Progress Tracker

A web application designed for tracking LeetCode progress among GDG on Campus Amity University Noida members. The tracker monitors weekly problem-solving activity with a target of 10 questions per week and provides visual progress indicators.

## Tech Stack

### Frontend
- **HTML5**
- **CSS3**
- **Vanilla JavaScript (ES6+)**

### Backend & Database
- **Firebase Firestore**: NoSQL cloud database for member data storage
- **Firebase SDK v8**: Real-time database operations and authentication

### External APIs
- **LeetCode Stats API**: `https://leetcode-stats.tashif.codes/`
  - Fetches user submission calendars and statistics
  - Retrieves total problems solved count
  - Provides weekly activity data for progress tracking

## Project Structure

```
Leetcode-Tracker/
├── index.html              # Main dashboard page - displays member progress
├── add.html               # Member registration form page
├── weekly.html            # Weekly breakdown view with daily activity
├── README.md              # Project documentation
├── css/
│   └── style.css          # Main stylesheet with responsive design
├── js/
│   ├── script.js          # Main dashboard logic and progress calculation
│   ├── add.js             # Member addition functionality
│   ├── weekly.js          # Weekly breakdown logic and data visualization
│   └── config.js          # Firebase configuration and API keys
├── img/                   # Image assets and logos
└── notes.txt              # Development notes and references
```

## Setup Instructions

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kanchanraiii/leetcode-tracker.git
   cd leetcode-tracker/Leetcode-Tracker
   ```

2. **Set up Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing one
   - Enable Firestore Database in production mode
   - Create a web app in your Firebase project
   - Copy the configuration object

3. **Configure Firebase**
   - Open `js/config.js`
   - Replace the existing configuration with your Firebase config:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key-here",
     authDomain: "your-project.firebaseapp.com", 
     projectId: "your-project-id",
     storageBucket: "your-project.firebasestorage.app",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

4. **Set up Firestore Database**
   - A collection named `members`
   - Set up security rules (for development):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```


## Firebase Configuration

### Firestore Database Structure

The application uses a simple Firestore structure:

**Collection: `members`**
```javascript
// Document example
{
  name: "John Doe",                    // Full name of the member
  "leetcode-username": "johndoe123"   // LeetCode profile username
}
```

### API Requests Made

The application makes the following API calls:

1. **LeetCode Stats API**
   ```
   GET https://leetcode-stats.tashif.codes/{username}
   ```
   - **Purpose**: Fetch user's LeetCode statistics
   - **Response**: JSON containing submission calendar and total problems solved
   - **Usage**: Calculate weekly progress and display activity patterns

2. **Firebase Firestore**
   - **Read Operations**: Fetch member list from `members` collection
   - **Write Operations**: Add new members to the database

