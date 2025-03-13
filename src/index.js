import './styles.css';

// API key from OpenWeatherMap (this is a sample API key that's publicly available)
const API_KEY = '5f472b7acba333cd8a035ea85a0d4d4c'; // Free API key for demo purposes

// DOM elements
const locationElement = document.getElementById('location');
const dateElement = document.getElementById('date');
const temperatureElement = document.getElementById('temperature');
const feelsLikeElement = document.getElementById('feels-like');
const descriptionElement = document.getElementById('description');
const iconElement = document.getElementById('icon');
const windElement = document.getElementById('wind');
const humidityElement = document.getElementById('humidity');
const pressureElement = document.getElementById('pressure');
const forecastContainer = document.getElementById('forecast');
const citySearchInput = document.getElementById('city-search');
const searchButton = document.getElementById('search-btn');
const locationButton = document.getElementById('get-location');

// Temperature chart
let tempChart;
// Weather conditions chart
let conditionsChart;

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

// Get weather data based on coordinates
function getWeatherByCoords(lat, lon) {
  Promise.all([
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`).then(res => res.json()),
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`).then(res => res.json())
  ])
  .then(([currentData, forecastData]) => {
    displayCurrentWeather(currentData);
    displayForecast(forecastData);
    createTemperatureChart(forecastData);
    createWeatherConditionsChart(forecastData);
  })
  .catch(error => {
    locationElement.textContent = 'Failed to fetch weather data';
    temperatureElement.textContent = error.message;
  });
}

// Get weather data based on city name
function getWeatherByCity(city) {
  Promise.all([
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`).then(res => {
      if (!res.ok) {
        throw new Error('City not found');
      }
      return res.json();
    }),
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`).then(res => {
      if (!res.ok) {
        throw new Error('Forecast not available');
      }
      return res.json();
    })
  ])
  .then(([currentData, forecastData]) => {
    displayCurrentWeather(currentData);
    displayForecast(forecastData);
    createTemperatureChart(forecastData);
    createWeatherConditionsChart(forecastData);
  })
  .catch(error => {
    locationElement.textContent = 'Error';
    temperatureElement.textContent = error.message;
  });
}

// Get weather based on user's position
function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  getWeatherByCoords(lat, lon);
}

// Format date for display
function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Format day for forecast
function formatDay(timestamp) {
  const date = new Date(timestamp * 1000);
  const options = { weekday: 'short' };
  return date.toLocaleDateString('en-US', options);
}

// Display current weather information
function displayCurrentWeather(data) {
  const city = data.name;
  const country = data.sys.country;
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const weatherDescription = data.weather[0].description;
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const windSpeed = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h
  const humidity = data.main.humidity;
  const pressure = data.main.pressure;
  const currentDate = formatDate(data.dt);
  
  // Update DOM elements
  locationElement.textContent = `${city}, ${country}`;
  dateElement.textContent = currentDate;
  temperatureElement.textContent = `${temp}°C`;
  feelsLikeElement.textContent = `Feels like: ${feelsLike}°C`;
  descriptionElement.textContent = weatherDescription;
  windElement.textContent = `${windSpeed} km/h`;
  humidityElement.textContent = `${humidity}%`;
  pressureElement.textContent = `${pressure} hPa`;
  
  // Create and display weather icon
  const iconImg = document.createElement('img');
  iconImg.src = iconUrl;
  iconImg.alt = weatherDescription;
  iconElement.innerHTML = '';
  iconElement.appendChild(iconImg);
}

// Display 5-day forecast
function displayForecast(data) {
  forecastContainer.innerHTML = '';
  
  // Get one forecast per day (data is every 3 hours)
  const dailyForecasts = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);
  
  dailyForecasts.forEach(forecast => {
    const day = formatDay(forecast.dt);
    const temp = Math.round(forecast.main.temp);
    const description = forecast.weather[0].description;
    const iconCode = forecast.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
    
    const forecastItem = document.createElement('div');
    forecastItem.className = 'forecast-item';
    forecastItem.innerHTML = `
      <div class="forecast-day">${day}</div>
      <div class="forecast-icon"><img src="${iconUrl}" alt="${description}"></div>
      <div class="forecast-temp">${temp}°C</div>
      <div class="forecast-desc">${description}</div>
    `;
    
    forecastContainer.appendChild(forecastItem);
  });
}

// Create temperature trend chart
function createTemperatureChart(forecastData) {
  const ctx = document.getElementById('temp-chart').getContext('2d');
  
  // Get forecast data for next 5 days
  const forecasts = forecastData.list.slice(0, 40);
  
  const labels = forecasts.map(item => {
    const date = new Date(item.dt * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) + 
           ' ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  });
  
  const temperatures = forecasts.map(item => Math.round(item.main.temp));
  const feelsLike = forecasts.map(item => Math.round(item.main.feels_like));
  
  // Destroy previous chart if it exists
  if (tempChart) {
    tempChart.destroy();
  }
  
  tempChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temperatures,
          borderColor: '#e74c3c',
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Feels Like (°C)',
          data: feelsLike,
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45
          },
          display: true,
          title: {
            display: true,
            text: 'Date & Time'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Temperature (°C)'
          }
        }
      }
    }
  });
}

// Create weather conditions chart
function createWeatherConditionsChart(forecastData) {
  const ctx = document.getElementById('conditions-chart').getContext('2d');
  
  // Get forecast data for next 5 days
  const forecasts = forecastData.list.slice(0, 40);
  
  const labels = forecasts.map(item => {
    const date = new Date(item.dt * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) + 
           ' ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  });
  
  const humidity = forecasts.map(item => item.main.humidity);
  const windSpeed = forecasts.map(item => Math.round(item.wind.speed * 3.6)); // Convert m/s to km/h
  const cloudiness = forecasts.map(item => item.clouds.all);
  
  // Destroy previous chart if it exists
  if (conditionsChart) {
    conditionsChart.destroy();
  }
  
  conditionsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Humidity (%)',
          data: humidity,
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          tension: 0.4,
          yAxisID: 'y',
          fill: true
        },
        {
          label: 'Wind Speed (km/h)',
          data: windSpeed,
          borderColor: '#2ecc71',
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          tension: 0.4,
          yAxisID: 'y1',
          fill: true
        },
        {
          label: 'Cloudiness (%)',
          data: cloudiness,
          borderColor: '#9b59b6',
          backgroundColor: 'rgba(155, 89, 182, 0.1)',
          tension: 0.4,
          yAxisID: 'y',
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      stacked: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45
          },
          display: true,
          title: {
            display: true,
            text: 'Date & Time'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Percentage (%)'
          },
          min: 0,
          max: 100
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Wind Speed (km/h)'
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      }
    }
  });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize with user's location
  getLocation();
  
  // Search by city
  searchButton.addEventListener('click', function() {
    const city = citySearchInput.value.trim();
    if (city) {
      getWeatherByCity(city);
    }
  });
  
  // Allow search by pressing Enter
  citySearchInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      const city = citySearchInput.value.trim();
      if (city) {
        getWeatherByCity(city);
      }
    }
  });
  
  // Get current location
  locationButton.addEventListener('click', getLocation);
});