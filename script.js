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
    },
    function () {
      alert('Could not get your position');
    }
  );
