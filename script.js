/**
 * Listens for the 'load' event on the window to handle online and offline status updates.
 * The function checks the navigator's online status and redirects the user to specific pages 
 * based on their connectivity. 
 * 
 * If the browser is online, and the current page is not '/src/index.html', 
 * it redirects to '/src/index.html'. Conversely, if the browser is offline, 
 * and the current page is not '/src/fallback.html', it redirects to '/src/fallback.html'.
 */
window.addEventListener('load', () => {
    function updateStatus() {
        const pathname = window.location.pathname;
        
        if (navigator.onLine) {
            if (!pathname.endsWith('/index.html')) {
                window.location.href = 'index.html';
            }
        } else {
            if (!pathname.endsWith('/fallback.html')) {
                window.location.href = 'fallback.html';
            }
        }
    }

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    updateStatus();
});

document.addEventListener("DOMContentLoaded", function () {
/**
 * Handles DOMContentLoaded event to set up interactive animations for an SVG element.
 * This script expects an SVG with the ID 'sun-svg' and a circle element within it with the ID 'sun-circle'.
 * It listens for click events on the 'sun-circle', toggling its color between yellow and orange,
 * and starting or stopping a rotate animation on the 'sun-svg'.
 */
    const svg = document.getElementById("sun-svg");
    const sunCircle = document.getElementById("sun-circle");

    let animationId;
    let rot = 0;
    let isAnimating = false;

    function animateSvg() {
        rot = (rot + 1) % 360;
        svg.style.transform = `rotate(${rot}deg)`;
        animationId = requestAnimationFrame(animateSvg);
    }

    sunCircle.addEventListener('click', function () {
        const currentFill = sunCircle.getAttribute('fill');
        sunCircle.setAttribute('fill', currentFill === 'yellow' ? 'orange' : 'yellow');

        if (!isAnimating) {
            isAnimating = true;
            animateSvg();
        } else {
            cancelAnimationFrame(animationId);
            isAnimating = false;
        }
    });
});



/**
 * Sets up the audio environment for a web application using the Web Audio API.
 * Initializes the audio context, audio elements, and connections for audio processing and control.
 * Also prepares UI elements like play, pause buttons, and a volume control slider.
 */
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
const audioElement = document.getElementById("audioElement");
const music = audioContext.createMediaElementSource(audioElement);
music.connect(audioContext.destination);
const gN = audioContext.createGain();

const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");

const volumeControl = document.getElementById("volumeControl");
music.connect(gN);
gN.connect(audioContext.destination);

/**
 * Plays the audio element using the AudioContext. If the AudioContext is suspended, it first
 * resumes the AudioContext and then starts playback. It handles errors for both resume and play actions.
 */
function playAudio() {
    if (audioContext.state === "suspended") {
        audioContext.resume().then(() => {
            audioElement.play().then(() => {
                playButton.dataset.playing = "true";
    
            }).catch(error => {
                console.error("Error playing audio:", error);
            });
        }).catch(error => {
            console.error("Error resuming audio context:", error);
        });
    } else {
        audioElement.play().then(() => {
            playButton.dataset.playing = "true";
        }).catch(error => {
            console.error("Error playing audio:", error);
        });
    }
}
/**
 * Pauses the audio playback
 */
function pauseAudio() {
    audioElement.pause();
    playButton.dataset.playing = "false";
}
// Adds click event listeners to the play and pause buttons to control audio playback.
playButton.addEventListener("click", playAudio);
pauseButton.addEventListener("click", pauseAudio);

// Adds input event listener to the volume control slider to adjust the gain node value.
volumeControl.addEventListener("input", function() {
    gN.gain.value = this.value;
});



const WeatherApp = {};
/**
 * Initializes the WeatherService within the WeatherApp namespace.
 * This service is responsible for managing API keys and constructing API URLs for weather data.
 *
 * @param {string} apiKey - API key for weather data service.
 */
    WeatherApp.WeatherService = function (apiKey) {
        this.apiKey = apiKey;
    };

    WeatherApp.WeatherService.prototype = {
    /**
     * Fetches weather data for a specified city or the current location and updates the UI accordingly.
    */
        getWeather: function () {
            const city = document.getElementById('city').value;
            const currentWeatherUrl = this.getWeatherUrl('weather', `q=${city}`);
            const forecastUrl = this.getWeatherUrl('forecast', `q=${city}`);
            WeatherApp.UIController.displayError('');
            WeatherApp.UIController.fetchData(currentWeatherUrl, forecastUrl);
        },
        fetchData: function (url) {
            return fetch(url).then(response => {
                if (!response.ok) {
                    throw new Error('There is no available forecast');
                }
                return response.json();
            });
        },

    /**
     * Constructs a URL for fetching weather data based on the query type and additional parameters.
     * @param {string} queryType - Type of weather data to fetch ('weather' or 'forecast').
     * @param {string} query - Additional parameters for the API call.
     * @returns {string} Constructed URL for the API call.
     */
        getWeatherUrl: function (queryType, query) {
            const baseUrl = 'https://api.openweathermap.org/data/2.5/';
            return `${baseUrl}${queryType}?${query}&appid=${this.apiKey}`;
        },

    /**
     * Fetches weather data for the user's current geographical location using the Geolocation API.
     */
        getWeatherInCurrentLocation: function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    const currentWeatherUrl = this.getWeatherUrl('weather', `lat=${lat}&lon=${lon}`);
                    const forecastUrl = this.getWeatherUrl('forecast', `lat=${lat}&lon=${lon}`);
                    WeatherApp.UIController.fetchData(currentWeatherUrl, forecastUrl);
                }, () => {
                    alert('Unable to retrieve your location');
                });
            }
        }
    };
/**
 * Manages the user interface for the WeatherApp. It provides methods for displaying weather data and handling errors.
 */
    WeatherApp.UIController = {
        selectCity: function (name) {
            document.getElementById('city').value = name;
            document.getElementById('cityList').innerHTML = "";
            localStorage.setItem('lastSearchedCity', name);
        },
    /**
     * Updates the list of city suggestions based on search input.
     * @param {Array} cities - Array of city objects to display as suggestions.
     */
        updateCityList: function (cities) {
            const cityList = document.getElementById('cityList');
            cityList.innerHTML = ''; 
            if(cities!==null){
                cities.forEach(city => {
                    const suggestionElement = document.createElement('div');
                    suggestionElement.className = 'city-suggestion';
                    suggestionElement.textContent = `${city.city}`;
                    suggestionElement.addEventListener('click', () => {
                        this.selectCity(city.city);
                    });
                    cityList.appendChild(suggestionElement);
                });
            }
      
        },
            
    /**
     * Displays the weather data on the UI.
     * @param {Object} data - The weather data to display.
     */
        displayWeather: function (data) {
            const tempDivInfo = document.getElementById('temp-div');
            const weatherInfoDiv = document.getElementById('weather-info');
            const weatherIcon = document.getElementById('weather-icon');
            const hourlyForecastDiv = document.getElementById('hourly-forecast');
            const cityList = document.getElementById('cityList');
            const city = document.getElementById('city');
            weatherInfoDiv.innerHTML = '';
            hourlyForecastDiv.innerHTML = '';
            tempDivInfo.innerHTML = '';
            cityList.innerHTML = '';

            if (data.code === '404') {
                weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
            } else {
                if (!data || !data.main || data.main.temp === undefined) {
                    console.error('Weather data is not in the expected format:', data);
                    return;
                }
                const cityName = data.name;
                localStorage.setItem('lastSearchedCity', cityName);
                city.value = cityName;
                const temperature = Math.round(data.main.temp - 273.15);
                const description = data.weather[0].description;
                const iconCode = data.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

                const temperatureHTML = `<p>${temperature}°C</p>`;
                const weatherHTML = `<p>${cityName}</p> <p>${description}</p>`;
                tempDivInfo.innerHTML = temperatureHTML;
                weatherInfoDiv.innerHTML = weatherHTML;
                weatherIcon.src = iconUrl;
                weatherIcon.alt = description;
            }
        },
    /**
     * Displays an hourly forecast using provided data.
     * @param {Array} hourlyData - Hourly weather data to display.
     */
        displayHourlyForecast: function (hourlyData) {
            const hourlyForecastDiv = document.getElementById('hourly-forecast');
            const next24Hours = hourlyData.slice(0, 8);

            next24Hours.forEach(item => {
                const dataTime = new Date(item.dt * 1000);
                const hour = dataTime.getHours();
                const temperature = Math.round(item.main.temp - 273.15);
                const iconCode = item.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

                const hourlyItemHtml = `
                    <div id="hourly-item">
                        <span>${hour}:00</span>
                        <img src="${iconUrl}" alt="Hourly Weather Icon">
                        <span>${temperature}°C</span>
                    </div>`;
                hourlyForecastDiv.innerHTML += hourlyItemHtml;
            });
        },
        fetchData: function (currentWeatherUrl, forecastUrl) {
            let errorDiv = document.getElementById('error-message');
            WeatherApp.weatherService.fetchData(currentWeatherUrl).then(data => {
                if (data.length !== 0) {
                    this.displayWeather(data);
                    errorDiv.innerText = '';
                } else {
                    throw new Error("No weather data available.");
                }
            }).catch(error => {
                console.error('Error fetching current weather data:', error);
                this.displayError('Failed to browse a forecast: the city does not exist.');
            });

            WeatherApp.weatherService.fetchData(forecastUrl).then(data => {
                if (data.list.length !== 0) {
                    this.displayHourlyForecast(data.list);
                    errorDiv.innerText = '';
                } else {
                    throw new Error("No forecast data available.");
                }
            }).catch(error => {
                console.error('Error fetching hourly forecast data:', error);
                this.displayError('Failed to browse a forecast: the city does not exist.');
            });
        },
    /**
     * Displays error messages in the UI.
     * @param {string} message - Error message to display.
     */
        displayError: function (message) {
            const errorDiv = document.getElementById('error-message');
            const tempDivInfo = document.getElementById('temp-div');
            const weatherInfoDiv = document.getElementById('weather-info');
            const hourlyForecastDiv = document.getElementById('hourly-forecast');
            const weatherIcon = document.getElementById('weather-icon');
            tempDivInfo.innerHTML = '';
            weatherInfoDiv.innerHTML = '';
            hourlyForecastDiv.innerHTML = '';
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            localStorage.removeItem('lastSearchedCity');
        }
    };
/**
 * SearchController within the WeatherApp for handling city search operations.
 */
    WeatherApp.SearchController = {
    /**
     * Searches for cities based on the input text and updates the UI with the results.
     */
        searchCity: function () {
            const input = document.getElementById('city').value;
            if (input.length < 1) {
                document.getElementById('cityList').innerHTML = "";
                return;
            }
            const apiUrl = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${input}`;
            fetch(apiUrl, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": 'wft-geo-db.p.rapidapi.com',
                    "x-rapidapi-key": '22c53ad45cmsh673f9ecea97542bp110e8cjsnd758e10ffeef'
                }
            })
                .then(response => response.json())
                .then(data => {
                    WeatherApp.UIController.updateCityList(data.data);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

   //Creates an instance of the WeatherService with a specific API key.
    WeatherApp.weatherService = new WeatherApp.WeatherService('1ff0cd236f86273bd4e05825c583a61e');

/**
 * Retrieves the last searched city from local storage and updates the weather information
 * if a city was previously searched.
 */
    const lastSearchedCity = localStorage.getItem('lastSearchedCity');
    if (lastSearchedCity) {
        document.getElementById('city').value = lastSearchedCity;
        WeatherApp.weatherService.getWeather();
    }
/**
 * Adds an 'input' event listener to the city input field to perform live search of cities
 * as the user types their query.
 */
    document.getElementById('city').addEventListener("input", function () {
        WeatherApp.SearchController.searchCity()
    });

/**
 * Adds a 'click' event listener to a button for fetching weather data based on the user's current location.
 */
    document.getElementById('chooseLocation').addEventListener("click", function () {
        WeatherApp.weatherService.getWeatherInCurrentLocation();
    });


/**
 * Validates a city name against a regex pattern to ensure it contains only letters and spaces.
 * @param {string} cityName - The city name to validate.
 * @returns {boolean} True if the city name is valid, false otherwise.
 */
    function validateCityName(cityName) {
        const regex = /^[a-zA-Z\s]+$/;
        return regex.test(cityName);
    }

/**
 * Adds a 'click' event listener to the action button which triggers weather data fetching
 * after validating the city name input by the user.
 */
    document.getElementById('actionButton').addEventListener("click", function () {
        const cityRegex = "^[a-zA-Z\s]+$";
        const cityInput = document.getElementById("city");
        const errorDiv = document.getElementById('error-message');
        const city = cityInput.value.trim();
        const tempDivInfo = document.getElementById('temp-div');
        const weatherInfoDiv = document.getElementById('weather-info');
        const hourlyForecastDiv = document.getElementById('hourly-forecast');
        const weatherIcon = document.getElementById('weather-icon');
        if(!city){
            errorDiv.textContent = "The city field cannot be empty.";
            tempDivInfo.innerHTML = '';
            weatherInfoDiv.innerHTML = '';
            hourlyForecastDiv.innerHTML = '';
        }
        else if(!validateCityName(city)){
            errorDiv.textContent = "Invalid city name. Please enter a valid city name containing only letters.";
            tempDivInfo.innerHTML = '';
            weatherInfoDiv.innerHTML = '';
            hourlyForecastDiv.innerHTML = '';
        }
        else{
            WeatherApp.weatherService.getWeather();
        }
       
    });