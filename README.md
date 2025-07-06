
AI-Based Travel Itinerary App
=============================

Welcome to the AI-Based Travel Itinerary App! This project allows users to create personalized travel itineraries based on their preferences like budget, location, and travel days. The app suggests day-wise activities, hotels, and provides comprehensive details using the Gemini API, Photos API, and Places API to gather and display information.

Features
--------

- **Personalized Itineraries**: Customize itineraries based on your budget, location, and days.
- **Hotel Recommendations**: Get a list of hotels based on your selected preferences.
- **Day-Wise Activities**: Detailed day-wise plans that suggest places to visit, dine, and explore.
- **AI Integration**: Uses AI-powered APIs (Gemini, Photos, and Places) to fetch real-time travel information and recommendations.

Project Setup
-------------

### Prerequisites

Make sure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (v6 or later)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-travel-itinerary-app.git
```

### 2. Install Dependencies

Navigate to the project folder and install the dependencies:

```bash
cd ai-travel-itinerary-app
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

Contributing
------------

We welcome contributions to improve this project! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request.

License
-------

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
