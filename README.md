# MovieFlix - Movie Recommendation System

A modern movie recommendation system built with Node.js, Express, MongoDB, and Tailwind CSS.

## Features

- 🔍 Search movies by name, genre, and rating
- ⭐ View top-rated movies by genre
- 🎯 Get personalized movie recommendations
- 📱 Responsive design for all devices
- ⚡ Fast and efficient search with MongoDB text indexes
- 📄 Pagination for browsing large movie collections

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd movie-recommendation-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
MONGODB_URI=mongodb://localhost:27017/movie-recommendation
PORT=3000
```

4. Start MongoDB service on your machine

5. Start the application:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
movie-recommendation-system/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server.js
├── package.json
├── .env
└── README.md
```

## API Endpoints

- `GET /api/movies/search` - Search movies with filters
- `GET /api/movies/top-rated` - Get top-rated movies by genre
- `GET /api/movies/recommended` - Get personalized movie recommendations

## Technologies Used

- Frontend:
  - HTML5
  - Tailwind CSS
  - JavaScript (ES6+)
  - Font Awesome Icons

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose

## Performance Optimizations

- MongoDB text indexes for fast search
- Efficient pagination implementation
- Optimized database queries
- Responsive image loading
- Caching strategies

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 