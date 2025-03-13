# Weather App

A simple web application that shows the current temperature and weather at the user's location.

## Features

- Gets user's location using browser geolocation
- Fetches real-time weather data from OpenWeatherMap API
- Displays current temperature, weather description, and icon
- Shows "feels like" temperature
- Clean, responsive design

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Build the application:
   ```
   npm run build
   ```
4. Start the development server:
   ```
   npm start
   ```

## How It Works

The application uses the browser's Geolocation API to get the user's coordinates, then makes a request to the OpenWeatherMap API to retrieve the current weather data for that location. The data is then displayed in a clean, user-friendly interface.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Webpack
- OpenWeatherMap API
- Geolocation API

## License

ISC