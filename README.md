# 🎬 CineVault

CineVault is a full-stack movie library application that helps users discover movies, organize their personal watchlists, and track their movie-watching journey.

Built using Angular, Node.js, Express, MongoDB, and TMDb API, CineVault combines movie discovery with a personal vault where users can save and manage their favorite films.

---

## Features

### 🔐 Authentication
- User Registration & Login
- JWT Authentication
- Protected Routes
- Secure Password Hashing using bcrypt

### 🎥 Movie Discovery
- Browse Trending Movies
- Popular Movies
- Top Rated Movies
- Upcoming Releases
- Movie Search
- Detailed Movie Information

### 📚 My Vault
- Save movies to your personal library
- Watch Status
  - Watching
  - Watched
  - Plan to Watch
- Mark movies as Favorites
- View personal movie collection

### 👤 User Profile
- Update Profile Information
- Change Password
- Persistent User Data

### 🎨 UI
- Responsive Design
- Glassmorphism-inspired Interface
- Dark Cinematic Theme
- Smooth Hover Animations
- Skeleton Loading States

---

# 🛠 Tech Stack

## Frontend

- Angular 21
- TypeScript
- RxJS
- HTML5
- CSS3

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- bcrypt

## APIs

- TMDb API

---

# 📂 Project Structure

```
movie/
│
├── client/
│   ├── src/
│   ├── app/
│   ├── services/
│   ├── pages/
│   └── components/
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── app.js
│
├── .env.example
├── package.json
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/dhanyadt/movie.git

cd movie
```

## Install Dependencies

### Root

```bash
npm install
```

### Client

```bash
cd client
npm install
```

### Server

```bash
cd ../server
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection

JWT_SECRET=your_secret

TMDB_API_KEY=your_tmdb_api_key
```

---

# ▶ Running the Application

From the project root:

```bash
npm start
```

Client:

```
http://localhost:4200
```

Server:

```
http://localhost:5000
```

---

---

# 🔮 Future Improvements

- AI-powered movie recommendations
- Movie reviews and ratings
- Streaming platform availability
- Watch history analytics
- Social features
- Recommendation engine
- Movie collections
- Deployment

---

# 👩‍💻 Author

**Dhanya D T**

GitHub:
https://github.com/dhanyadt
