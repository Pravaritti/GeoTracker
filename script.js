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

/////////////////////////////////////////////////////////////////////

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10); // change date into string and take last 10 numbers

  constructor(coords, distance, duration) {
    //we give construtor parameters so that user has some control over how the object is made

    this.coords = coords; //[lat, lng]
    this.distance = distance; //in kms
    this.duration = duration; //in mins
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    //should have same constructor parameters + addition
    super(coords, distance, duration); //super class to the common parameters
    this.cadence = cadence; //initialise new parameter

    //call calcPace function inside constructor to immideately calcualte Pace
    this.calcPace();
  }
  calcPace() {
    //min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }
  calcSpeed() {
    // km/hr
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

const run1 = new Running([39, -12], 5.2, 24, 178);
const cycle1 = new Cycling([39, -12], 5.2, 24, 178);
console.log(run1, cycle1);

///////////////////////////////////////////////////////////// APPLICATION ARCHITECTURE

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map; //private properties of App class
  #mapEvent;
  #workouts = [];

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
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp)); //function to check if it is a valid number and not letters or symbols

    const allPositive = (...inputs) => inputs.every(inp => inp > 0); //fucntion for positive input check

    e.preventDefault(); // default of form is submitting

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value; //changed to number
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // if workout running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      // Check if data is valid
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs have to be positive numbers'); //guard clause

      workout = new Running([lat, lng], distance, duration, cadence); //new object created
    }
    // if workout cycling, create running object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      // Check if data is valid
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration) //elevation can be negative
      )
        return alert('Inputs have to be positive numbers'); //guard clause
      workout = new Cycling([lat, lng], distance, duration, elevation); //new object created
    }
    // Add new object to workout array
    this.#workouts.push(workout); //add this object to array
    console.log(workout);

    // Render workout on map as marker
    console.log(this.#mapEvent);
    this.renderWorkputMarker(workout);

    //Render workout on list

    //hide form + Clear input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
  }

  renderWorkputMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent('workout')
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
