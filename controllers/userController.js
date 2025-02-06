const db = require('../config/db');
const Train = require('../models/Train');
const Booking = require('../models/Booking');


// logic for getting AVAILABLE seat  

exports.getSeat = async (req, res) => {

  const { source, destination } = req.query;
  
  if(!source || !destination){
    return res.status(400).json({
      message:'Data is not filled'
    })
  }
  
  try {
    const trains = await Train.getTrainsByRoute(source, destination);
  
    if (trains.length === 0) {
      return res.status(404).json({ 
        message: 'No trains available for this route' 
      });
    }

    // mapping the train with the avaiable train and seat
    const availableTrains = trains.map(train => (
      {
      trainNumber: train.train_number,
      availableSeats: train.available_seats
    }
  )
);

const trainSeats = availableTrains.filter(train => train.availableSeats > 0);

  // cnt the number of trains and seat details

  res.status(200).json({
    available: trainSeats.length > 0,
    availableTrainCount: trainSeats.length, 
    trains: availableTrains
  });

} 
  catch (err) {
    console.error('Error Finding seat availability:', err);
    res.status(500).json({ 
        message: 'Error fetching seat availability', error: err.message 
      }
    );
  }
};
  



//Logic for booking seat 
exports.bookSeat = async (req, res) => {
  const { trainId, seatsToBook } = req.body;
  const userId = req.user.id; // Extract user ID from the middleware

  const conn = await db.getConnection();
  try {
    console.log("Start booking tickets");

    // Begin a transaction to handle race conditions
    await conn.beginTransaction();
    console.log("Start Transaction");

    // Fetch the train details, locking the row for updates (FOR UPDATE clause)
    const [train] = await conn.query(
      "SELECT total_seats, available_seats FROM trains WHERE id = ? FOR UPDATE",
      [trainId]
    );
    console.log("Train fetched:", train);

    // If train doesn't exist, rollback and return an error
    if (!train.length) {
      console.log("Train not found");
      await conn.rollback();
      return res.status(404).json({ message: "Train not found" });
    }

    const availableSeats = train[0].available_seats;
    console.log("Available seats:", availableSeats);

    // Check if there are enough available seats
    if (availableSeats < seatsToBook) {
      console.log("Not enough seats available");
      await conn.rollback();
      return res.status(400).json({
        message: "Not enough seats available"
      });
    }

    // Update the available seats in the database
    await conn.query(
      "UPDATE trains SET available_seats = available_seats - ? WHERE id = ?",
      [seatsToBook, trainId]
    );
    console.log("Seats updated");

    // Create the booking record in the database
    await Booking.create(userId, trainId, seatsToBook, conn);
    console.log("Booking done");

    // Commit the transaction
    await conn.commit();
    res.json({ message: "Seats booked successfully" });

  } catch (err) {
    console.error("Error during booking:", err.message);
    await conn.rollback();
    res.status(500).json({
      message: "Error booking seats",
      error: err.message
    });
  } finally {
    conn.release();
  }
};


  
//getting all the boooking details of user 
exports.getBookingDetail = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const query = `
        SELECT 
          b.id AS booking_id,
          b.seats AS number_of_seats,
          t.train_number,
          t.source,
          t.destination
        FROM bookings b
        JOIN trains t ON b.train_id = t.id
        WHERE b.user_id = ?
      `;
  
      const [rows] = await db.query(query, [userId]);
      res.json(rows);
    } catch (err) {
      console.error(
        'Error fetching booking details:', err.message
      );
      res.status(500).json({ 
        message: 'Error fetching booking details' 
      });
    }
  };
  