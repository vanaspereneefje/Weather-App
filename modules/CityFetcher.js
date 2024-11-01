export default class CityFetcher {
    constructor(){
        this.baseUrl = "https://geocoding-api.open-meteo.com/v1/search";
    }

    async fetchCityCoordinates(cityName) {
        try {
          const response = await fetch(`${this.baseUrl}?name=${encodeURIComponent(cityName)}&count=10&language=en&format=json`);
          const data = await response.json();
      
              //get longitude and latitude and round off to 2 decimals
              const longitude = Math.round(data.results[0].longitude * 100) / 100;
              const latitude = Math.round(data.results[0].latitude * 100) / 100;

            return {
                latitude,
                longitude
            };
        } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
        }
    }
}

