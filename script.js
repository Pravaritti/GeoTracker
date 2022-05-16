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

class App {
  #map; //private properties of App class
  #mapEvent;

  constructor() {
    this._getPosition(); // so that this function is called as soon as this constructor is called i.e when object is made i.e when page is loaded

    //we need these event listeners to be acticated right in the beginning (as soon as the map loads)
    //render form
    form.addEventListener(
      'submit',
      this._newWorkout.bind(this) // because it is an event handler function which has this keyword of event handler to whoch it is attached . this is attached to form and not App object. thats why we bind this to it to point it to object itself.
    );

    inputType.addEventListener('change', this._toggleElevationField);
  }

  _getPosition() {
    //geolocation API is actually a browser API that the browser gives us like timer and other APIs
    //it takes 2 callback functions 1. success callback(when it gets coordinates successfully) 2. error callback
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
        }
      );
  }

  _loadMap(position) {
    //display map using 3rd party library - leaflet(an open source JS library for mobile friendly interations)
    console.log(position);
    const { latitude } = position.coords; //destructuring
    const { longitude } = position.coords; //destructuring
    console.log(latitude, longitude);
    //checking it on google maps
    console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];

    //from leaflet.com -> overview
    this.#map = L.map('map').setView(coords, 13);
    // L = a namespace and has few methods like map()
    //'map' = an element in HTML

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault(); // default of form is submitting

    //Clear input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    //display marker
    console.log(this.#mapEvent);
    const { lat, lng } = this.#mapEvent.latlng;

    L.marker([lat, lng])
      .addTo(this.#map)
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
    //     //color to popups are defined in CSS file
  }
}

//Creating object (using constructor)
const app = new App();

/////////////////////////////////////////////////
//using class for better architecture
// class WORKOUT -> child RUNNING
//////////////// -> child CYCLING
