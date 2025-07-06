
# 🌍 Trippy AI – Smart Travel Itinerary App

Trippy AI is a full-stack web application that generates **personalized travel itineraries** using Google OAuth and AI-powered APIs. With inputs like location, budget, and duration, it provides day-wise plans, hotel recommendations, and activity suggestions.

Built with:
- 🔥 React
- ☁️ Firebase (Auth + Firestore)
- 🤖 Gemini API
- 🗺️ Google Places API & Photos API
- 🎨 Tailwind CSS & Framer Motion

---

## ✨ Features

- 🔐 **Google Login**: One-click secure login with Google OAuth.
- 🧠 **AI-Powered Suggestions**: Smart day-wise plans based on user preferences.
- 🏨 **Hotel Recommendations**: Fetches curated hotel suggestions.
- 🗓️ **Day-Wise Activities**: Explore places to visit, eat, and relax.
- 🖼️ **Photo Previews**: Location images powered by Google Photos API.
- 📱 **Responsive UI**: Designed with Tailwind CSS + animated via Framer Motion.
- 🔎 **Realtime Database**: User-specific data stored securely via Firebase Firestore.

---

## 🚀 Getting Started

### ✅ Prerequisites

Ensure these are installed:

- [Node.js](https://nodejs.org/) v14 or later  
- [npm](https://www.npmjs.com/)  
- [Git](https://git-scm.com/)

---

### 🔧 Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/aitravel.git
```

### 2. Install Dependencies

Navigate to the project folder and install the dependencies:

```bash
cd aitravel
npm install
```

### 3. Environment Variables

Create a `.env` file in the root of the project and add your API keys for the Gemini API, Photos API, and Places API:

```
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
REACT_APP_PHOTOS_API_KEY=your_photos_api_key
REACT_APP_PLACES_API_KEY=your_places_api_key
```

### 4. Start the Development Server

Run the following command to start the development server:

```bash
npm start
```

The app will be available at `http://localhost:3000`.

Code Quality
-------------

The app has been designed with the following principles in mind:

- **Modular Structure**: The app's components are reusable and follow a component-driven development approach.
- **Clean Code**: The code is easy to read, maintain, and extend, following JavaScript and React best practices.
- **API Integration**: The Gemini, Photos, and Places APIs are integrated for real-time information, with efficient error handling and loading states.
- **Responsive Design**: The app is fully responsive and optimized for mobile and desktop views.
- **Unit Testing**: Unit tests are written using Jest and React Testing Library to ensure the stability of the application.

```bash
trippy-ai/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.js
├── .env
├── package.json
└── README.md
```
