require('dotenv').config();

let autocomplete1, autocomplete2

function initAutocomplete() {
    autocomplete1 = new google.maps.places.Autocomplete(document.getElementById('text-input-1'), { types: ['(cities)'] })
    autocomplete2 = new google.maps.places.Autocomplete(document.getElementById('text-input-2'), { types: ['(cities)'] })

    autocomplete1.addListener('place_changed', onPlaceChanged)
    autocomplete2.addListener('place_changed', onPlaceChanged)
}

function onPlaceChanged() {
    const place1 = autocomplete1.getPlace()
    const place2 = autocomplete2.getPlace()
    
    if (!place1.geometry || !place2.geometry) {
        console.log('Place not found')
        return
    }
}

function makeApiCall() {
    const place1 = autocomplete1.getPlace()
    const place2 = autocomplete2.getPlace()
    
    if (!place1.geometry || !place2.geometry) {
        console.log('Place not found')
        return
    }

    const lat1 = place1.geometry.location.lat()
    const lon1 = place1.geometry.location.lng()
    const lat2 = place2.geometry.location.lat()
    const lon2 = place2.geometry.location.lng()

    const apiKey = process.env.API_KEY
    const url1 = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat1}&lon=${lon1}&appid=${apiKey}`
    const url2 = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat2}&lon=${lon2}&appid=${apiKey}`

    Promise.all([fetch(url1), fetch(url2)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(([data1, data2]) => {
            displayWeatherData(data1, data2, place1.name, place2.name)
        })
        .catch(err => console.error(err))
}

function getWeatherIcon(weatherCode) {
    const iconMapping = {
        200: '11d', 201: '11d', 202: '11d', 210: '11d', 211: '11d', 212: '11d', 221: '11d', 230: '11d', 231: '11d', 232: '11d',
        300: '09d', 301: '09d', 302: '09d', 310: '09d', 311: '09d', 312: '09d', 313: '09d', 314: '09d', 321: '09d',
        500: '10d', 501: '10d', 502: '10d', 503: '10d', 504: '10d', 511: '13d', 520: '09d', 521: '09d', 522: '09d', 531: '09d',
        600: '13d', 601: '13d', 602: '13d', 611: '13d', 612: '13d', 613: '13d', 615: '13d', 616: '13d', 620: '13d', 621: '13d', 622: '13d',
        701: '50d', 711: '50d', 721: '50d', 731: '50d', 741: '50d', 751: '50d', 761: '50d', 762: '50d', 771: '50d', 781: '50d',
        800: '01d', 801: '02d', 802: '03d', 803: '04d', 804: '04d'
    };

    return iconMapping[weatherCode] || '01d'
}

function displayWeatherData(data1, data2, cityName1, cityName2) {
    const weatherResults = document.getElementById('weather-results')
    weatherResults.style.display = 'flex'
    weatherResults.style.border = '2px solid aliceblue'

    const tempCelsius1 = (data1.current.temp - 273.15).toFixed(2)
    const tempFahrenheit1 = ((data1.current.temp - 273.15) * 9/5 + 32).toFixed(2)
    const tempCelsius2 = (data2.current.temp - 273.15).toFixed(2)
    const tempFahrenheit2 = ((data2.current.temp - 273.15) * 9/5 + 32).toFixed(2)

    const windSpeed1 = data1.current.wind_speed
    const windSpeed2 = data2.current.wind_speed

    const icon1 = getWeatherIcon(data1.current.weather[0].id)
    const icon2 = getWeatherIcon(data2.current.weather[0].id)

    weatherResults.innerHTML = `
        <div class="weather-card">
            <h2>${cityName1}</h2>
            <img src="icons/${icon1}.png" alt="${data1.current.weather[0].description}">
            <p>Temperature: ${tempCelsius1}°C / ${tempFahrenheit1}°F</p>
            <p>Weather: ${data1.current.weather[0].description}</p>
            <p><img src="icons/humidity.png" alt="Humidity"> Humidity: ${data1.current.humidity}%</p>
            <p><img src="icons/wind.png" alt="Wind Speed"> Wind Speed: ${windSpeed1} m/s</p>
        </div>
        <div class="weather-card">
            <h2>${cityName2}</h2>
            <img src="icons/${icon2}.png" alt="${data2.current.weather[0].description}">
            <p>Temperature: ${tempCelsius2}°C / ${tempFahrenheit2}°F</p>
            <p>Weather: ${data2.current.weather[0].description}</p>
            <p><img src="icons/humidity.png" alt="Humidity"> Humidity: ${data2.current.humidity}%</p>
            <p><img src="icons/wind.png" alt="Wind Speed"> Wind Speed: ${windSpeed2} m/s</p>
        </div>
    `
}
