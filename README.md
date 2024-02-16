# Books Application

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.6.

## Backend Setup

To run the backend, follow these steps:

1. Clone the backend repository:

   ```bash
   git clone https://github.com/Tomislav10/books-backend
   ```

2. Install global dependencies (if not already installed):

   ```bash
   npm install -g ts-node typescript
   ```

3. Navigate to the backend directory:

   ```bash
   cd books-backend
   ```

4. Install local dependencies:

   ```bash
   npm install
   ```

5. Start the backend:

   ```bash
   npm start
   ```

   Ensure you have a running MySQL database, and the backend will automatically create the required tables.


6. Configure the database connection details in the `ormconfig.json` file.

## Frontend Setup

To run the frontend, follow these steps:

1. Clone the frontend repository:

   ```bash
   git clone https://github.com/Tomislav10/books-frontend
   ```

2. Navigate to the frontend directory:

   ```bash
   cd books-frontend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the frontend:

   ```bash
   npm start
   ```

## Backend and Frontend features

The Books application is a full-stack web application for users to manage their favorite books. It integrates backend and frontend technologies, offering a secure and user-friendly experience.

### Backend Features

- **User Authentication:** Enables user registration, login, and token generation (both refresh and access tokens).
- **Token Refresh Mechanism:** Access tokens expire after 30 seconds. The application seamlessly renews them using the refresh token, which lasts for 7 days.
- **Favorite Books Management:** Allows add, remove or get books as favorites, storing the selections persistently in the database.

### Frontend Features

- **Registration and Login:** Provides a streamlined registration and login process for users.
- **Secure Token Storage:** Refresh tokens are stored in cookies, while access tokens are kept only at the application level (neither in local storage nor cookies).
- **Favorite Books List:** Displays a list of books, allowing users to mark and unmark their favorites.
- **Detailed Book View:** Users can view detailed information about each book, including its title, publisher, and release date.
- **NgRx for State Management:** Implements NgRx for efficient and scalable state management.
- **Material Design UI:** Utilizes Material Design for a modern and consistent user interface.

## Technologies Used

### Backend

- Node.js
- TypeScript
- Express.js
- TypeORM
- MySQL

### Frontend

- Angular
- NgRx
- RxJs
- Material Design

## Configuration

- Backend configuration details, including database connection settings, can be found in the `ormconfig.json` file.

## My other similar project

You can check out another project I worked on four years ago; it's a similar application, 
and you have a live demo: https://github.com/Tomislav10/Phonebook

