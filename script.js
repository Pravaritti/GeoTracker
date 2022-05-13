'use strict';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

/////////////////////////////////////////////////////////////////////

//geolocation API is actually a browser API that the browser gives us like timer and other APIs
//it takes 2 callback functions 1. success callback(when it gets coordinates successfully) 2. error callback
if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      console.log(position);
      const { latitude } = position.coords; //destructuring
      const { longitude } = position.coords; //destructuring
      console.log(latitude, longitude);
      //checking it on google maps
      console.log(`https://www.google.co.in/maps/@${latitude},${longitude}`);

      const coords = [latitude, longitude];

      //from leaflet.com -> overview
      const map = L.map('map').setView(coords, 13);
      // L = a namespace and has few methods like map()
      //'map' = an element in HTML

      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker(coords)
        .addTo(map)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup();

      //similar to addEventHAndler -> in leaflet we use .on
      map.on('click', function (mapEvent) {
        console.log(mapEvent); //this event happens every time we click on map
        const { lat, lng } = mapEvent.latlng;

        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(
            L.popup({
              maxWidth: 250,
              minWidth: 100,
              autoClose: false,
              closeOnClick: false,
              className: 'running-popup',
            })
          )
          .setPopupContent('Workout')
          .openPopup(); //read leaflet documentation to customize popup
        //color to popups are defined in CSS file
      });
    },
    function () {
      alert('Could not get your position');
    }
  );
//display map using 3rd party library - leaflet(an open source JS library for mobile friendly interations)
