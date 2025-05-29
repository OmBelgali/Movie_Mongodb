// API endpoints
const API = {
    search: '/api/movies/search',
    topRated: '/api/movies/top-rated',
    recommended: '/api/movies/recommended'
};

// State management
let currentPage = 1;
let totalPages = 1;
let currentView = 'search';

// DOM Elements
const moviesGrid = document.getElementById('moviesGrid');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const genreSelect = document.getElementById('genreSelect');
const ratingSelect = document.getElementById('ratingSelect');
const searchBtn = document.getElementById('searchBtn');
const homeBtn = document.getElementById('homeBtn');
const topRatedBtn = document.getElementById('topRatedBtn');
const recommendedBtn = document.getElementById('recommendedBtn');
const movieModal = document.getElementById('movieModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');

// Event Listeners
searchBtn.addEventListener('click', () => {
    currentPage = 1;
    currentView = 'search';
    fetchMovies();
});

homeBtn.addEventListener('click', () => {
    currentPage = 1;
    currentView = 'search';
    fetchMovies();
});

topRatedBtn.addEventListener('click', () => {
    currentView = 'topRated';
    fetchTopRated();
});

recommendedBtn.addEventListener('click', () => {
    currentView = 'recommended';
    fetchRecommended();
});

closeModal.addEventListener('click', () => {
    movieModal.classList.add('hidden');
});

// Fetch movies based on search criteria
async function fetchMovies() {
    showLoading();
    const query = searchInput.value;
    const genre = genreSelect.value;
    const rating = ratingSelect.value;

    try {
        console.log('Fetching movies with params:', { query, genre, rating, page: currentPage });
        const response = await fetch(`${API.search}?query=${encodeURIComponent(query)}&genre=${encodeURIComponent(genre)}&minRating=${encodeURIComponent(rating)}&page=${currentPage}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received movies data:', data);
        
        if (!data.movies || !Array.isArray(data.movies)) {
            throw new Error('Invalid response format');
        }

        displayMovies(data.movies);
        totalPages = data.totalPages;
        updatePagination();
    } catch (error) {
        console.error('Error fetching movies:', error);
        showError('Error fetching movies: ' + error.message);
        moviesGrid.innerHTML = '<div class="col-span-full text-center text-red-500">Failed to load movies. Please try again.</div>';
    }
    hideLoading();
}

// Fetch top rated movies
async function fetchTopRated() {
    showLoading();
    try {
        console.log('Fetching top rated movies');
        const response = await fetch(API.topRated);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received top rated data:', data);
        
        if (!Array.isArray(data)) {
            throw new Error('Invalid response format');
        }

        displayTopRated(data);
    } catch (error) {
        console.error('Error fetching top rated movies:', error);
        showError('Error fetching top rated movies: ' + error.message);
        moviesGrid.innerHTML = '<div class="col-span-full text-center text-red-500">Failed to load top rated movies. Please try again.</div>';
    }
    hideLoading();
}

// Fetch recommended movies
async function fetchRecommended() {
    showLoading();
    try {
        console.log('Fetching recommended movies');
        const response = await fetch(API.recommended);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received recommended data:', data);
        
        if (!Array.isArray(data)) {
            throw new Error('Invalid response format');
        }

        displayMovies(data);
    } catch (error) {
        console.error('Error fetching recommended movies:', error);
        showError('Error fetching recommended movies: ' + error.message);
        moviesGrid.innerHTML = '<div class="col-span-full text-center text-red-500">Failed to load recommended movies. Please try again.</div>';
    }
    hideLoading();
}

// Display movies in the grid
function displayMovies(movies) {
    moviesGrid.innerHTML = '';
    if (!movies || movies.length === 0) {
        moviesGrid.innerHTML = '<div class="col-span-full text-center text-gray-400">No movies found</div>';
        return;
    }

    // Split movies into two groups: first 3, and the rest
    const firstGroup = movies.slice(0, 3);
    const secondGroup = movies.slice(3);

    // Create first section
    const section1 = document.createElement('div');
    section1.className = 'col-span-full mb-8 p-6 rounded-xl bg-black text-white shadow-lg flex flex-wrap gap-8 justify-center';
    firstGroup.forEach(movie => {
        const movieCard = createMovieCard(movie);
        section1.appendChild(movieCard);
    });
    moviesGrid.appendChild(section1);

    // Create second section if there are more movies
    if (secondGroup.length > 0) {
        const section2 = document.createElement('div');
        section2.className = 'col-span-full mb-8 p-6 rounded-xl bg-black text-white shadow-lg flex flex-wrap gap-8 justify-center';
        secondGroup.forEach(movie => {
            const movieCard = createMovieCard(movie);
            section2.appendChild(movieCard);
        });
        moviesGrid.appendChild(section2);
    }
}

// Display top rated movies by genre
function displayTopRated(genres) {
    if (!genres || genres.length === 0) {
        moviesGrid.innerHTML = '<div class="col-span-full text-center text-gray-400">No top rated movies found</div>';
        return;
    }

    moviesGrid.innerHTML = '';
    genres.forEach(genre => {
        const genreSection = document.createElement('div');
        genreSection.className = 'col-span-full mb-8';
        genreSection.innerHTML = `
            <h2 class="text-xl font-bold mb-4">${genre._id} (Avg Rating: ${genre.avgRating.toFixed(1)})</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                ${genre.movies.map(movie => createMovieCard(movie).outerHTML).join('')}
            </div>
        `;
        moviesGrid.appendChild(genreSection);
    });
}

// Create a movie card element
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col items-center w-[220px] text-white';
    card.innerHTML = `
        <img src="${movie.posterUrl || 'https://via.placeholder.com/220x330'}" 
             alt="${movie.title}" 
             class="movie-poster w-[200px] h-[300px] object-cover rounded-t-lg"
             onerror="this.src='https://via.placeholder.com/220x330?text=No+Image'">
        <div class="p-4 w-full flex-1 flex flex-col justify-between">
            <h3 class="text-lg font-bold mb-2 text-center text-white">${movie.title}</h3>
            <div class="flex items-center mb-2 justify-center text-white">
                <div class="rating-stars">
                    ${generateStars(movie.rating)}
                </div>
                <span class="ml-2">${movie.rating.toFixed(1)}</span>
            </div>
            <div class="flex flex-wrap gap-2 mb-2 justify-center text-white">
                ${movie.genre.map(g => `<span class="bg-gray-700 px-2 py-1 rounded text-sm text-white">${g}</span>`).join('')}
            </div>
            <button class="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded mt-2"
                    onclick="showMovieDetails(${JSON.stringify(movie).replace(/\"/g, '&quot;')})">
                View Details
            </button>
        </div>
    `;
    return card;
}

// Generate star rating HTML
function generateStars(rating) {
    // Ensure rating is a valid number between 0 and 5
    const validRating = Math.min(Math.max(Number(rating) || 0, 0), 5);
    const fullStars = Math.floor(validRating);
    const halfStar = validRating % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - fullStars - (halfStar ? 1 : 0));

    return `
        ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
        ${halfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
        ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
    `;
}

// Show movie details in modal
function showMovieDetails(movie) {
    modalTitle.textContent = movie.title;
    modalContent.innerHTML = `
        <div class="flex flex-col md:flex-row gap-6">
            <img src="${movie.posterUrl || 'https://via.placeholder.com/300x450'}" 
                 alt="${movie.title}" 
                 class="w-full md:w-1/3 rounded-lg"
                 onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
            <div class="flex-1">
                <div class="mb-4">
                    <h3 class="text-xl font-bold mb-2">Details</h3>
                    <p class="text-gray-300">${movie.description || 'No description available.'}</p>
                </div>
                <div class="mb-4">
                    <h3 class="text-xl font-bold mb-2">Cast</h3>
                    <p class="text-gray-300">${movie.cast ? movie.cast.join(', ') : 'No cast information available.'}</p>
                </div>
                <div class="mb-4">
                    <h3 class="text-xl font-bold mb-2">Director</h3>
                    <p class="text-gray-300">${movie.director || 'No director information available.'}</p>
                </div>
                <div class="mb-4">
                    <h3 class="text-xl font-bold mb-2">Release Year</h3>
                    <p class="text-gray-300">${movie.releaseYear || 'No release year available.'}</p>
                </div>
            </div>
        </div>
    `;
    movieModal.classList.remove('hidden');
    movieModal.classList.add('modal-enter');
}

// Update pagination controls
function updatePagination() {
    if (currentView !== 'search') return;
    
    pagination.innerHTML = '';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = `px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'}`;
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            fetchMovies();
        }
    };
    pagination.appendChild(prevBtn);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `px-4 py-2 rounded ${currentPage === i ? 'bg-red-500' : 'bg-gray-800 hover:bg-gray-700'}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => {
            currentPage = i;
            fetchMovies();
        };
        pagination.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = `px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'}`;
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchMovies();
        }
    };
    pagination.appendChild(nextBtn);
}

// Loading state management
function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.id = 'loadingIndicator';
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loadingIndicator');
    if (loading) {
        loading.remove();
    }
}

// Error handling
function showError(message) {
    const error = document.createElement('div');
    error.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded shadow-lg z-50';
    error.textContent = message;
    document.body.appendChild(error);
    setTimeout(() => error.remove(), 3000);
}

// Initial load
fetchMovies(); 