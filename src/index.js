import './styles.css';

// API key from OpenWeatherMap (this is a sample API key that's publicly available)
const API_KEY = '5f472b7acba333cd8a035ea85a0d4d4c'; // Free API key for demo purposes

// DOM elements
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const iconElement = document.getElementById('icon');

// Get user's location
function getLocation() {
  if (navigator.geolocation) {
    locationElement.textContent = 'Getting your location...';
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    locationElement.textContent = 'Geolocation is not supported by this browser.';
  }
}

// Handle geolocation errors
function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      locationElement.textContent = 'User denied the request for geolocation.';
      break;
    case error.POSITION_UNAVAILABLE:
      locationElement.textContent = 'Location information is unavailable.';
      break;
    case error.TIMEOUT:
      locationElement.textContent = 'The request to get user location timed out.';
      break;
    case error.UNKNOWN_ERROR:
      locationElement.textContent = 'An unknown error occurred.';
      break;
  }
  temperatureElement.textContent = 'Cannot retrieve temperature';
}

// Get weather data based on user's position
function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      return response.json();
    })
    .then(data => {
      displayWeather(data);
    })
    .catch(error => {
      locationElement.textContent = 'Failed to fetch weather data';
      temperatureElement.textContent = error.message;
    });
}

// Display weather information
function displayWeather(data) {
  const city = data.name;
  const country = data.sys.country;
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const weatherDescription = data.weather[0].description;
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  
  locationElement.textContent = `${city}, ${country}`;
  temperatureElement.textContent = `${temp}°C`;
  descriptionElement.textContent = weatherDescription;
  
  // Create and display weather icon
  const iconImg = document.createElement('img');
  iconImg.src = iconUrl;
  iconImg.alt = weatherDescription;
  iconElement.innerHTML = '';
  iconElement.appendChild(iconImg);
  
  // Add feels like information
  const feelsLikeElement = document.createElement('div');
  feelsLikeElement.textContent = `Feels like: ${feelsLike}°C`;
  feelsLikeElement.style.fontSize = '16px';
  feelsLikeElement.style.marginTop = '5px';
  temperatureElement.appendChild(feelsLikeElement);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', getLocation);