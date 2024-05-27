### Project description

The app shows user the temperature at a given time and also the forecast of temperature and weather (represented by an image, e.g., rain/sun) for the whole day with a 3-hour interval. Users will have the option to use geolocation if they do not want to enter the city manually.
The basic functions of the app:
* User can paly/pause music, change it`s volume.
* The app assists users in entering the city by using the fetch API, so they do not have to type the full city name and can choose from a list of cities.
* When clicking on the sun circle, it animates it`s behaviour.
* When user goes to offline mode, after reload, user will be rediercted to offline page where it is written "You are currently offline" and the sun circle still can be animated.
* The app uses local storage, so that the last searched city will be stored even when user reloads the page. 
* The app implements basic validation, so that user can not find a forecast for an empty city name and for invalid city name. Error message appears when anything goes wrong. 

### Documentation

This website was created using a combination of technologies and APIs to provide an interactive experience for users. The following components were used:
* LocalStorage API
* SVG (the sun svg on the web page)
* CSS transformation (for scaling the name of the web page)
* CSS transition (for buttons)
* Web Audio API (for playing music)
* Geolocation
* Animation of sun SVG using JavaScript
* Media Queries


