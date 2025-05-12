const socket = io();

const carList = document.getElementById('car-list');
const form = document.getElementById('car-form');

const cars = new Map();

function renderCar(car) {
    const li = document.createElement('li');
    li.id = `car-${car.id}`;
    li.textContent = `${car.number} (${car.model}) — ${car.driver} [${car.lat.toFixed(4)}, ${car.lon.toFixed(4)}]`;
    return li;
}

function updateCarInDOM(car) {
    const li = document.getElementById(`car-${car.id}`);
    if (li) {
        li.textContent = `${car.number} (${car.model}) — ${car.driver} [${car.lat.toFixed(4)}, ${car.lon.toFixed(4)}]`;
    }
}

socket.on('initCars', initCars => {
    initCars.forEach(car => {
        cars.set(car.id, car);
        carList.appendChild(renderCar(car));
    });
});

socket.on('carAdded', car => {
    cars.set(car.id, car);
    carList.appendChild(renderCar(car));
});

socket.on('updateLocations', updatedCars => {
    updatedCars.forEach(car => {
        cars.set(car.id, car);
        updateCarInDOM(car);
    });
});

form.addEventListener('submit', e => {
    e.preventDefault();
    const number = document.getElementById('number').value;
    const model = document.getElementById('model').value;
    const driver = document.getElementById('driver').value;
    socket.emit('addCar', { number, model, driver });

    form.reset();
});
