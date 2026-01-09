const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
};

const app = express();
app.use(express.json());

app.listen(port, () => {
    console.log('Server running on port:', port);
})

app.get('/allcars', async(req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.cars');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error for allcars'});

    }
})

app.post('/addcar', async(req, res) => {
    const {car_name, car_pic} = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO cars (car_name, car_pic) VALUES (?,?)', [car_name, car_pic]);
        res.status(201).json({message: car_name+' added successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not add'+car_name });
    }
});

app.post('/deletecar/:id', async(req, res) => {
    const {id} = req.params;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM cars WHERE id = ?', [id]);
        res.status(200).json({message: 'Car of ID'+id+' has been deleted successfully.'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete car of ID'+id});
    }
});

app.post('/carupdate/:id', async(req, res) => {
    const {car_name, car_pic, id} = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('UPDATE cars SET car_name = ?, car_pic = ? WHERE id = ?', [car_name, car_pic, id]);
        res.status(201).json({message: car_name+' has been updated successfully.'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not update'+car_name });
    }
});
