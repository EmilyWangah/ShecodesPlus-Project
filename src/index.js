// Function to get the weather icon based on description
function getWeatherIcon(description) {
  if (description.includes("rain")) {
    return "icons/rain.png"; 
  } else if (description.includes("clear")) {
    return "icons/sun.png"; 
  } else if (description.includes("cloud")) {
    return "icons/cloud.png"; 
  } else {
    return "icons/windy.png"; 
  }
}

// Function to display temperature
function displayTemperature(response) {
  let temperatureElement = document.querySelector("#current-temperature");
  let temperature = Math.round(response.data.temperature.current);
  let cityElement = document.querySelector("#current-city");
  let description = response.data.condition.description; // Get weather description
  let iconElement = document.querySelector(".current-temperature-icon"); 

  cityElement.innerHTML = response.data.city;
  temperatureElement.innerHTML = `${temperature}°C`;
  
  // Replace the emoji with the appropriate weather icon image
  let iconUrl = getWeatherIcon(description);
  iconElement.innerHTML = `<img src="${iconUrl}" alt="${description}" />`;

  // After displaying current temperature, fetch the forecast
  getForecast(response.data.city);
}


function search(event) {
  if (event) {
    event.preventDefault(); 
  }
  
  let searchInputElement = document.querySelector("#search-input");
  let city = searchInputElement && searchInputElement.value !== "" ? searchInputElement.value : "Katima Mulilo"; 

  let apiKey = "b2a5adcct04b33178913oc335f405433"; 
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl)
    .then(displayTemperature)
    .catch(function (error) {
      console.error("Error fetching weather data:", error);
    });
}

// Function to format the date
function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let day = date.getDay();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  let formattedDay = days[day];
  return `${formattedDay} ${hours}:${minutes}`;
}

// Display the current date and time
let currentDateElement = document.querySelector("#current-date");
let currentDate = new Date();
currentDateElement.innerHTML = formatDate(currentDate);

// Function to get the weather forecast
function getForecast(city) {
  let apiKey = "b2ftbed3f683eac832c6c0ec983o4a40"; 
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl)
    .then(displayForecast)
    .catch(function (error) {
      console.error("Error fetching forecast data:", error);
    });
}

// Function to display the weather forecast
function displayForecast(response) {
  console.log(response); // Debugging: Check API response
  let forecastElement = document.querySelector("#forecast");
  if (!forecastElement) {
    console.error("Forecast element not found");
    return;
  }
  
  let forecast = response.data.daily;
  let forecastHTML = `<div class="weather-forecast">`;

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      let description = forecastDay.condition.description; // Get forecast description
      let icon = getWeatherIcon(description); // Get the icon based on description

      let date = new Date(forecastDay.time * 1000);
      let day = days[date.getDay()];

      forecastHTML += 
        `<div class="weather-forecast-day">
          <div class="weather-forecast-date">${day}</div>
          <div class="weather-forecast-icon">
            <img src="${icon}" alt="${description}" />
          </div>
          <div class="weather-forecast-temperature">
            <strong>${Math.round(forecastDay.temperature.maximum)}°</strong> /
            ${Math.round(forecastDay.temperature.minimum)}°
          </div>
        </div>`;
    }
  });

  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// Add event listener to the search form
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", search);


search();
