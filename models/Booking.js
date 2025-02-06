const db = require('../config/db');

const Booking = {
  create: async (userId, trainId, seats, connection) => { 
   console.log('Creating booking with:', { userId, trainId, seats }); 
    try {
      const query = `
        INSERT INTO bookings (user_id, train_id, seats)
        VALUES (?, ?, ?)
      `;
        const [result] = await connection.query(query, [userId, trainId, seats]); 
        console.log('Booking created, ID:', result.insertId); 
      return result.insertId;

    } 
    catch (err) {

      console.error('Error creating booking:', err.message); 
      throw new Error('Error creating booking: ' + err.message);
      
    }
  },
};



module.exports = Booking;

