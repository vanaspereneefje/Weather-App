export default class WeatherFetcher {
    constructor() {
        this.baseUrl = "https://api.open-meteo.com/v1/forecast"
    }

    async fetchWeatherData(latitude, longitude, hour) {
        try {
          const response = await fetch(`${this.baseUrl}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min`);
          const data = await response.json();
      
            const currentTemperature = Math.round(data.hourly.temperature_2m[hour]);
            const dailyMinTemps = data.daily.temperature_2m_min;
            const dailyMaxTemps = data.daily.temperature_2m_max;
            const currentWeatherCode = data.hourly.weather_code[hour];
            const dailyWeatherCodes = data.daily.weather_code;
            const dayAmount = 5;
            const weatherPictograms = []

            const descriptionResponse = await fetch('https://vanaspereneefje.github.io/Weather-App/data/descriptions.json');
            const descriptionData = await descriptionResponse.json();
            
            const weatherDescriptionDay = descriptionData[currentWeatherCode];
            const weatherDescription = weatherDescriptionDay.day.description;
            const weatherPictogramDay = weatherDescriptionDay.day.image;

            for(let i = 0; i < dayAmount; i++) {
              const dailyWeatherCode = dailyWeatherCodes[i + 1];
              const weatherDescriptionDay = descriptionData[dailyWeatherCode];
              weatherPictograms[i] = weatherDescriptionDay.day.image;
            }
            
            return {
                currentTemperature,
                dailyMinTemps,
                dailyMaxTemps,
                currentWeatherCode,
                dailyWeatherCodes,
                weatherDescription,
                weatherPictogramDay,
                weatherPictograms
            };
       
        } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
        }
      }
}

