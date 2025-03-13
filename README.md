# Mohaimens Weather App

A simple web application that shows the current temperature and weather at the user's location.

Visit the live app at: https://mohaimenhasan.github.io/weather-app

## Features

- Gets user's location using browser geolocation
- Search for weather by city name
- Fetches real-time weather data from OpenWeatherMap API
- Displays current temperature, weather description, and icon
- Shows "feels like" temperature, wind speed, humidity, and pressure
- 5-day weather forecast
- Interactive temperature trend chart
- Weather conditions visualization (humidity, wind speed, cloudiness)
- Clean, responsive design with modern UI

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

## Deployment

The app automatically deploys to GitHub Pages on every push to the main branch using GitHub Actions workflow.

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