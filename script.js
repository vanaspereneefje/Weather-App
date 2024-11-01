import CityFetcher from './modules/CityFetcher.js';
import WeatherFetcher from './modules/WeatherFetcher.js';

const cityFetcher = new CityFetcher();
const weatherFetcher = new WeatherFetcher();

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
let cityName = "";

async function handleCitySearch(cityName) {
  try {
    // Fetch city coordinates
    const { latitude, longitude } = await cityFetcher.fetchCityCoordinates(cityName);
    
    // Fetch weather data
    const hour = new Date().getUTCHours();
    const weatherData = await weatherFetcher.fetchWeatherData(latitude, longitude, hour);

    clearPreviousForecasts()

    updateWeatherDisplay(weatherData);

  } catch (error) {
    console.error("Error in handleCitySearch:", error);
  }
}

function updateWeatherDisplay(weatherData) {
  showTemperature(weatherData.currentTemperature);
  addDivider();
  showMinMaxTemperature(weatherData.dailyMinTemps, weatherData.dailyMaxTemps);
  todayForecast.appendChild(currentCondition);
  addCurrentPictogram(weatherData.weatherPictogramDay);
  addCurrentState(weatherData.weatherDescription);
  weathercards(weatherData.weatherPictograms, weatherData.dailyMinTemps, weatherData.dailyMaxTemps);
}

function clearPreviousForecasts() {
  document.querySelectorAll('.weather-card, .temperature, .current-state, .crop-current-pictogram, .min-max-div, .divider')
    .forEach(element => element.remove());
}

function weathercards(weatherPictograms, dailyMinTemps, dailyMaxTemps, dayAmount = 5) {
  for(let i = 0; i < dayAmount; i++) {
    const d = new Date();
    const weatherCard = document.createElement("div");
    weatherCard.classList.add("weather-card");
    fiveDayForeCast.appendChild(weatherCard);

    // Display days of the week on the weather cards (first one needs to be "today")
    let day = weekday[(d.getDay() + i + 1) % 7];
    const weekDay = document.createElement("p");
    weekDay.classList.add("week-day");
    weekDay.textContent = day;
    weatherCard.appendChild(weekDay);

    const cropPictogram = document.createElement("div");
    cropPictogram.classList.add("crop-pictogram");
    weatherCard.appendChild(cropPictogram);

    const pictogram = document.createElement("img");
    pictogram.src = weatherPictograms[i];
    pictogram.classList.add("pictogram");
    pictogram.alt = "weather condition for the following days";
    cropPictogram.appendChild(pictogram);

    const maxTempVis = document.createElement("p");
    maxTempVis.classList.add("max-temperature");
    maxTempVis.textContent = `${Math.round(dailyMaxTemps[i + 1])}°c`; 
    weatherCard.appendChild(maxTempVis);

    const minTempVis = document.createElement("p");
    minTempVis.classList.add("min-temperature");
    minTempVis.textContent = `${Math.round(dailyMinTemps[i + 1])}°c`;
    weatherCard.appendChild(minTempVis);
  }
}

function addDivider() {
  const divider = document.createElement("div");
  divider.classList.add("divider");
  todayForecast.appendChild(divider);
}

const weatherAppDiv = document.createElement("div");
weatherAppDiv.classList.add("weather-app");
document.body.appendChild(weatherAppDiv);

const searchDiv = document.createElement("div");
searchDiv.classList.add("search-div");
weatherAppDiv.appendChild(searchDiv);
  
const userInputLabel = document.createElement("label");
userInputLabel.for = "location-search";
userInputLabel.textContent = "Search city: ";
const userInput = document.createElement("input");
userInput.type = "search";
userInput.classList.add("search");
userInput.id = "location-search";
searchDiv.appendChild(userInputLabel);
searchDiv.appendChild(userInput);

const city = document.createElement("p");
city.classList.add("city");
city.textContent = cityName;
weatherAppDiv.appendChild(city);

//api must only be called once the user finishes typing
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
  
userInput.addEventListener("search", debounce(async () => {
    const cityName = userInput.value;
    if(cityName) {
        handleCitySearch(cityName);
        city.textContent = cityName; 
    }
    unsplashImages(cityName)
  }));

function showTemperature(temperature) {
  const tempVis = document.createElement("p");
  tempVis.classList.add("temperature");
  tempVis.textContent = `${temperature}°c`;
  todayForecast.appendChild(tempVis);
}

function showMinMaxTemperature(dailyMinTemps, dailyMaxTemps) {
  const minmaxDiv = document.createElement("div");
  minmaxDiv.classList.add("min-max-div");
  todayForecast.appendChild(minmaxDiv);
  
  const maxTempVis = document.createElement("p");
  maxTempVis.classList.add("max-temperature-today");
  maxTempVis.textContent = `${Math.round(dailyMaxTemps[0])}°c`;
  minmaxDiv.appendChild(maxTempVis);

  const minTempVis = document.createElement("p");
  minTempVis.classList.add("min-temperature-today");
  minTempVis.textContent = `${Math.round(dailyMinTemps[0])}°c`;
  minmaxDiv.appendChild(minTempVis);
}

const todayForecast = document.createElement("div");
todayForecast.classList.add("today-forecast");
weatherAppDiv.appendChild(todayForecast);

const currentCondition = document.createElement("div");
currentCondition.classList.add("current-condition");

function addCurrentPictogram(weatherPictogramDay){
  const croppedCurrentPictogram = document.createElement("div");
  croppedCurrentPictogram.classList.add("crop-current-pictogram");
  currentCondition.appendChild(croppedCurrentPictogram);
  const currentPictogram = document.createElement("img");
  currentPictogram.classList.add("current-pictogram");
  currentPictogram.src = weatherPictogramDay;
  currentPictogram.alt = "Current weather condition";
  croppedCurrentPictogram.appendChild(currentPictogram);
}

function addCurrentState(current) {
  const currentState = document.createElement("p");
  currentState.classList.add("current-state");
  currentState.textContent = current;
  currentCondition.appendChild(currentState);
}
  
const fiveDayForeCast = document.createElement("div");
fiveDayForeCast.classList.add("five-day-forecast");
weatherAppDiv.appendChild(fiveDayForeCast);

async function unsplashImages(cityName) {
  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?client_id=y7-dcvc-iP4s1AgoQ07Iem-cmsn3Ouh41LO-ExKUFLo&query=${cityName}`);
    const data = await response.json();

    const getAllImages = data.results[0];
    const getImage = getAllImages.urls.regular;

    const previousImage = document.querySelectorAll(".city-image");
    previousImage.forEach(result => result.remove());

    displayImage(getImage);

  } catch (error) {
    console.error('Error fetching Unsplash data:', error);
  }
}

function displayImage(getImage) {
  // Set the background image
  document.body.style.backgroundImage = `url('${getImage}')`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
  document.body.style.backgroundRepeat = 'no-repeat';
}
