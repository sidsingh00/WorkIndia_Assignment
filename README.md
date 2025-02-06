# Railway Management System

A RESTful API for a **Railway Management System** like IRCTC, built with Express.js and MYSQL.

## Features

- User registration and authentication
- Admin-only operations for managing trains
- Real-time seat availability checking
- Secure seat booking with race condition handling
- Booking details retrieval

## Prerequisites

- Node.js (v14 or higher)
- MySQL (8.0.40)
- Postman

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/sidsingh00/WorkIndia_Assignment
   cd railway-management-system
   ```

2. Install dependencies:
   ```bash
   npm install bcryptjs cors dotenv express jsonwebtoken mysql2
   npm install --save-dev jest nodemon
   npm install
   ```

3. Create a `.env` file based on `.env.example` and fill in your configuration:
   ```
   PORT=3000
    DB_USER=root
    DB_HOST=localhost
    DB_NAME=irctc_database
    DB_PASSWORD=onedirection
    DB_PORT=3306
    JWT_SECRET=Work_India
    Admin-api-key= WORKINDIA123

   ```

4. Set up the database:
   - Create a new MYSQL database as irctc_database
   - Run the migration script from `database/schema.sql`
   ```bash
    
    CREATE DATABASE irctc_database;
    USE irctc_database;
    SHOW TABLES;

    CREATE TABLE trains (
    train_number INT PRIMARY KEY,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL
    );

    INSERT INTO trains (train_number, source, destination, total_seats, available_seats)
    VALUES
    (101, 'ranchi', 'delhi', 200, 150),
    (102, 'ranchi', 'bhopal', 180, 120),
    (103, 'mumbai', 'pune', 100, 50);

```
5. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
    1. Register a new user
       * HTTP Method :- POST
       * Endpoint :- http://localhost:3000/user/register
       * Body:
```bash
- POST `/api/auth/register` - Register a new user
{
  "name": "sidharth",
  "email": "sidharth111@gmail.com",
  "password": "sidharth1234"
}
```
    2. Login
   - HTTP Method :- POST
   - Endpoint :- http://localhost:3000/user/login
   - Body:
```bash
- POST `/api/auth/login` - Login and get JWT token
{
  "email": "sidharth111@gmail.com",
  "password": "sidharth1234"
}
```
### Trains availability

- GET `/api/trains/availability` - Get trains between stations
   - HTTP Method :- GET
   - Endpoint :- http://localhost:3000/user/availability?source=Delhi&destination=Mumbai
   - Query Parameters
     - source: Source station (e.g., "Bhopal")
     - destination: Destination station (e.g., "Delhi")
   - Response:

```bash
GET
{
  "available": true,
  "availableTrainCount": 1,
  "trains": [
    {
      "trainNumber": "12345",
      "availableSeats": 96
    }
  ]
}
```


### Bookings Seat

- POST `/api/bookings` - Book a seat
    - HTTP Method :- POST
    - Endpoint :- http://localhost:3000/user/book
    - Request Body:
 
```bash

Authorization : Bearer <Token>
POST
{
  "trainId": 2,
  "seatsToBook": 3
}
```


- GET `/api/bookings/:id` - Get booking details

    - HTTP Method :- GET
    - Endpoint :- http://localhost:3000/user/getAllbookings

    - Response:

```bash
GET

[
  {
    "booking_id": 1,
    "number_of_seats": 2,
    "train_number": "12345",
    "source": "Delhi",
    "destination": "Mumbai"
  },
  {
    "booking_id": 2,
    "number_of_seats": 1,
    "train_number": "54321",
    "source": "Kolkata",
    "destination": "Chennai"
  }
]

```


#### Admin Route

1.  Add a new train

    - HTTP Method :- POST
    - Endpoint :- http://localhost:3000/admin/addTrain
    - Request Body:

```bash
   POST
  [
    {
      "trainNumber": "100",
      "source": "Delhi",
      "destination": "Mumbai",
      "totalSeats": 150
    },
    {
      "trainNumber": "888",
      "source": "Chennai",
      "destination": "Bangalore",
      "totalSeats": 200
    }
  ]


```

         * Headers :
             * Admin-api-key: Admin API key which is stored in .env
             so here we use the secret key because of the admin authentication as the admin can add some value or not

2. Update seat availability

   - HTTP Method :- PUT
   - Endpoint :- http://localhost:3000/admin/update-seats/1
   - Request Body:
         * Headers :
             * Admin-api-key: Admin API key which is stored in .env
  
```bash
   PUT
  {
  "totalSeats": 200,
  "availableSeats": 150
 }

```


## Security

- JWT-based authentication for protected routes
- API key authentication for admin operations
- Row Level Security (RLS) in database
- Password hashing using bcrypt

## Race Condition Handling

The booking system uses PostgreSQL's transaction isolation and row-level locking to prevent race conditions during seat booking:

1. Starts a transaction
2. Locks the train record
3. Checks seat availability
4. Creates booking and updates seat count atomically
5. Commits or rolls back the transaction

## Assumptions

1. Each booking is for one seat only
2. Train routes are direct (no intermediate stations)
3. Admin users are created directly in the database
4. Cancellation feature is not implemented
5. Seat numbers are not assigned (only total count is maintained)



# photos of the project
### Screenshots of the Project
#### 1. Database Creation
Description: Creation of the Table for the IRCTC management system in MYSQL

![Database Creation Screenshot](./Images/DATABASE_1.png)
![Database Creation Screenshot](./Images/DATABASE_2.png)


#### 2. User Registration
Description: Check if the user exist's

![Registration User](./Images/Register.png)

---

#### 3. User Login
Description: Login the person

![Login User](./Images/Login.png)

---


#### 2. Train Availability
Description: This demonstrates how the GET /user/availability API is used to check train availability.

![Train Availability Screenshot](./Images/Availability_1.png)
![Train Availability Screenshot](./Images/Availability_2.png)


Run tests using:
```bash
npm run start
npm run dev
```# WorkIndia_Assignment_SDE_Intern
