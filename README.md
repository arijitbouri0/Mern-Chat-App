
# Chat Application


This is a real-time chat application built with React, Node.js, Express, MongoDB , Cloudinary and Socket.io. It allows users to send and receive messages and notification in real-time, create group, send attachments and interact seamlessly.


## Demo
Live Link:
https://mern-chat-app-u26b.vercel.app/

### Guest Login Credentials
To explore the application without creating an account, you can use the following guest login credentials:

#### Guest User 1
```bash
 Username: guest1
 Password: Guestuser1@
```
#### Guest User 2
```bash
 Username: guest2
 Password: Guestuser2@
```
Simply enter these credentials on the login page to access the application as a guest.
## Screenshots

### Authorization
![Authorization Screenshot](https://raw.githubusercontent.com/arijitbouri0/Mern-Chat-App/main/Client/public/Screenshot%202024-12-11%20202833.png)

### Home Page
![Home Screenshot](https://raw.githubusercontent.com/arijitbouri0/Mern-Chat-App/main/Client/public/Screenshot%202024-12-11%20202949.png)

### Chat Page
![Chat Screenshot](https://raw.githubusercontent.com/arijitbouri0/Mern-Chat-App/main/Client/public/Screenshot%202024-12-11%20203047.png)

### Profile
![Profile Screenshot](https://raw.githubusercontent.com/arijitbouri0/Mern-Chat-App/main/Client/public/Screenshot%202024-12-11%20203123.png)

### Manage Groups
![Manage Groups Screenshot](https://raw.githubusercontent.com/arijitbouri0/Mern-Chat-App/main/Client/public/Screenshot%202024-12-11%20203104.png)

## Features

- Real-time Messaging: Seamlessly send and receive messages using Socket.io.
- User Authentication: Login and signup functionality using JWT.
- Cloudinary Integration: Upload and share images in chat.
- Chat Rooms Support: Join different chat rooms.
- MongoDB Integration: Store messages and user information.
- Responsive UI: Fully functional on both desktop and mobile devices using Material Ui.


## Tech Stack

- Frontend: React, Socket.io (Client)
- Backend: Node.js, Express, Socket.io (Server)
- Database: MongoDB 
- Cloud Storage: Cloudinary (for uploading files)
- Hosting: Render.com, Vercal (optional)


## Run Locally

### Setup Backend

Clone the project

```bash
  git clone https://github.com/arijitbouri0/Mern-Chat-App

```

1.Navigate to Server Directory
```bash
  cd Server
```

2.Install dependencies
```bash
  npm install
```

3.Create a .env file and add:
```bash
  PORT=8000
  MONGODB_URI='your-mongodb-connection-string'
  JWT_SECRET='your-secret-key'
  CLOUDINARY_CLOUD_NAME='your-cloud-name'
  CLOUDINARY_API_KEY='your-api-key'
  CLOUDINARY_API_SECRET='your-api-secret'
```

4.Start the Backend Server
```bash
  npm run dev
```
### Setup Frontend

1.Navigate to the client folder:
```bash
cd ../client
```

3.Create a .env file and add:
```bash
BACKEND_SERVER='http://localhost:8000'
```

Install frontend dependencies:
```bash
npm install
```

Run the React App
```
npm run dev
```
## License

[MIT](https://choosealicense.com/licenses/mit/)


## Support

For support, email arijitbouri0@gmail.com .

