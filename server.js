const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-recommendation', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Movie Schema
const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: [{ type: String, required: true }],
    rating: { type: Number, required: true },
    description: String,
    releaseYear: Number,
    director: String,
    cast: [String],
    posterUrl: String,
    views: { type: Number, default: 0 }
});

// Create text index for search
movieSchema.index({ title: 'text', genre: 'text' }, { 
    weights: {
        title: 2,  // Give more weight to title matches
        genre: 1
    },
    name: 'text_search_index'
});

const Movie = mongoose.model('Movie', movieSchema);

// Create text index if it doesn't exist
Movie.createIndexes().then(() => {
    console.log('Text indexes created successfully');
}).catch(err => {
    console.error('Error creating text indexes:', err);
});

// Routes
app.get('/api/movies/search', async (req, res) => {
    try {
        const { query, genre, minRating, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        let searchQuery = {};
        
        // Build search query
        if (query) {
            searchQuery.$text = { $search: query };
        }
        if (genre) {
            searchQuery.genre = genre;
        }
        if (minRating) {
            searchQuery.rating = { $gte: parseFloat(minRating) };
        }

        // Add text score to results if there's a text search
        const projection = query ? { score: { $meta: "textScore" } } : {};
        const sort = query ? { score: { $meta: "textScore" } } : { rating: -1 };

        const movies = await Movie.find(searchQuery, projection)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Movie.countDocuments(searchQuery);

        res.json({
            movies,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/movies/top-rated', async (req, res) => {
    try {
        const movies = await Movie.aggregate([
            {
                $group: {
                    _id: '$genre',
                    avgRating: { $avg: '$rating' },
                    movies: { $push: '$$ROOT' }
                }
            },
            { $sort: { avgRating: -1 } },
            { $limit: 10 }
        ]);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/movies/recommended', async (req, res) => {
    try {
        const { userId } = req.query;
        // In a real application, you would use the user's watch history
        // For now, we'll return movies with high ratings and views
        const movies = await Movie.find()
            .sort({ rating: -1, views: -1 })
            .limit(10);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 