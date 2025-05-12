const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let cars = [];

function getRandomCoords() {
    const lat = 50.45 + Math.random() * 0.05;
    const lon = 30.52 + Math.random() * 0.05;
    return { lat, lon }; 
}

setInterval(() => {
    cars.forEach(car => {
        const { lat, lon } = getRandomCoords();
        car.lat = lat;
        car.lon = lon;
    });
    io.emit('updateLocations', cars);
}, 3000);

app.use(express.static('public'));

io.on('connection', socket => {
    console.log('👤 Новий клієнт підключився');

    socket.emit('initCars', cars); 

    socket.on('addCar', carData => {
        const newCar = {
            id: Date.now(), 
            number: carData.number,
            model: carData.model,
            driver: carData.driver,
            ...getRandomCoords()
        };
        cars.push(newCar);
        io.emit('carAdded', newCar); 
    });

    socket.on('disconnect', () => {
        console.log('❌ Клієнт відключився');
    });
});

server.listen(3000, () => {
    console.log('🚖 Сервер запущено на http://localhost:3000');
});