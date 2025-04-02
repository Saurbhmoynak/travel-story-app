# Travel Story App

## 📌 Overview

The **Travel Story App** is a web-based platform where users can share their travel experiences, upload images, and explore various travel destinations. The application allows users to document their journeys with details like title, date, visited places, images, and a short story.

### **Why Travel Story App?**
In today’s digital age, travelers love to capture and share their experiences with the world. The Travel Story App provides an engaging and seamless way to document adventures while connecting with other travel enthusiasts. Users can browse inspiring travel stories, get recommendations, and create their personal travel diary, making it a one-stop destination for all travel lovers.

## 🎯 Features

- 🌍 **User-Friendly Interface** – Easily navigate and post travel stories.
- 📸 **Image Upload** – Upload and display travel images.
- 📝 **Story Submission** – Share travel experiences with a title and description.
- 📍 **Visited Places** – Mark locations visited.
- 🔍 **Explore Stories** – Browse and read travel experiences shared by others.
- 🗂 **Categorization** – Filter stories based on places, dates, and user preferences.
- 🔑 **Login and Signup** – Secure authentication for users.
- 🔎 **Search Stories** – Quickly find stories using search functionality.
- 📅 **DayPicker** – Select and filter stories by date.

## 🛠 Tech Stack

### **Frontend:**

- Vite + React (for UI development)
- Tailwind CSS / Bootstrap (for styling)
- Axios (for API requests)
- React Router (for navigation)
- Moment.js (for date formatting)
- React Icons (for icons)
- React Toastify (for notifications)
- Image Compression (for optimizing uploaded images)
- DayPicker (for selecting dates)

#### **Install Frontend Dependencies**
```bash
cd frontend
npm install vite react tailwindcss bootstrap axios react-router-dom moment react-icons react-toastify browser-image-compression react-day-picker
```

### **Backend:**

- Node.js (runtime environment)
- Express.js (backend framework)
- MongoDB (database for storing travel stories)
- Multer (for handling image uploads)
- Bcrypt (for password hashing)
- Jsonwebtoken (for authentication)
- Cors (for handling cross-origin requests)
- Dotenv (for environment variable management)

#### **Install Backend Dependencies**
```bash
cd backend
npm install express mongoose multer bcrypt jsonwebtoken cors dotenv
```

### **Deployment:**

- Frontend: Vercel
- Backend: Vercel
- Database: MongoDB Atlas

## 🚀 Installation & Setup

### **1️⃣ Clone the Repository**

```bash
  git clone https://github.com/yourusername/travelstory-app.git
  cd travelstory-app
```

### **2️⃣ Install Dependencies**

#### **Frontend**
```bash
cd frontend
npm install
```

#### **Backend**
```bash
cd backend
npm install
```

### **3️⃣ Configure Environment Variables**

Create a `.env` file in the backend directory and add the following:

```env
PORT= ****
MONGO_URI=your-mongodb-connection-string
ACCESS_TOKEN_SECRET=your-secret-key
FRONTEND_URL=your-frontend-url
```

### **4️⃣ Start the Application**

#### **Start Backend Server**

```bash
cd backend
npm run start
```

#### **Start Frontend Server**

```bash
cd frontend
cd travel-story-app
npm run dev
```

The application should now be running on `http://localhost:5173` (frontend) and `http://localhost:3000` (backend).

## 🔄 API Endpoints

### **1️⃣ User Routes**

| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| POST   | /api/users/signup | User registration |
| POST   | /api/users/login  | User login        |

### **2️⃣ Travel Story Routes**

| Method | Endpoint          | Description              |
| ------ | ----------------- | ------------------------ |
| GET    | /api/stories      | Fetch all travel stories |
| POST   | /api/stories      | Add a new travel story   |
| GET    | /api/stories/\:id | Fetch a single story     |
| PUT    | /api/stories/\:id | Update a story           |
| DELETE | /api/stories/\:id | Delete a story           |

### **3️⃣ Image Upload Route**

| Method | Endpoint    | Description     |
| ------ | ----------- | --------------- |
| POST   | /api/upload | Upload an image |

## 🎯 Future Enhancements

✅ User authentication (Login & Signup)
✅ Comments & likes on travel stories
✅ Google Maps integration to mark visited places
✅ Profile management for users
✅ Social media sharing of stories

## 📢 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## 📜 License

This project is licensed under the MIT License. You are free to use, modify, and distribute this project for any purpose, provided that the original license terms are retained in all copies or substantial portions of the software.

---

**🌟 Made with ❤️ by Saurbh Moynak**

