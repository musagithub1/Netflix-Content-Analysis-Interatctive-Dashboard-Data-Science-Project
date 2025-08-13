// Netflix Dashboard JavaScript

// Global variables
let dashboardData = {};
let charts = {};

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupTabNavigation();
});

// Initialize dashboard
async function initializeDashboard() {
    try {
        showLoading(true);
        await loadAllData();
        renderAllCharts();
        showLoading(false);
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showLoading(false);
        alert('Error loading dashboard data. Please refresh the page.');
    }
}

// Show/hide loading indicator
function showLoading(show) {
    const loading = document.getElementById('loading');
    loading.style.display = show ? 'block' : 'none';
}

// Load all data from API
async function loadAllData() {
    try {
        const [statsResponse, overviewResponse, deepDiveResponse, storytellingResponse] = await Promise.all([
            fetch('/api/netflix/stats'),
            fetch('/api/netflix/overview'),
            fetch('/api/netflix/deep-dive'),
            fetch('/api/netflix/storytelling')
        ]);

        dashboardData.stats = await statsResponse.json();
        dashboardData.overview = await overviewResponse.json();
        dashboardData.deepDive = await deepDiveResponse.json();
        dashboardData.storytelling = await storytellingResponse.json();

        updateStatsCards();
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

// Update stats cards
function updateStatsCards() {
    const stats = dashboardData.stats;
    document.getElementById('total-titles').textContent = stats.total_titles.toLocaleString();
    document.getElementById('total-movies').textContent = stats.total_movies.toLocaleString();
    document.getElementById('total-tv-shows').textContent = stats.total_tv_shows.toLocaleString();
    document.getElementById('countries-count').textContent = stats.countries_count.toLocaleString();
}

// Setup tab navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Render all charts
function renderAllCharts() {
    renderOverviewCharts();
    renderDeepDiveCharts();
    renderStorytellingCharts();
}

// Render overview charts
function renderOverviewCharts() {
    const overview = dashboardData.overview;

    // Content Type Chart (Bar)
    const contentTypeCtx = document.getElementById('contentTypeChart').getContext('2d');
    charts.contentType = new Chart(contentTypeCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(overview.content_by_type),
            datasets: [{
                label: 'Number of Titles',
                data: Object.values(overview.content_by_type),
                backgroundColor: ['#E50914', '#FF6B6B'],
                borderColor: ['#B8070F', '#FF5252'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: 'white' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} titles`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });

    // Content Growth Chart (Line)
    const contentGrowthCtx = document.getElementById('contentGrowthChart').getContext('2d');
    charts.contentGrowth = new Chart(contentGrowthCtx, {
        type: 'line',
        data: {
            labels: overview.content_growth.map(item => item.year_added),
            datasets: [{
                label: 'Titles Added',
                data: overview.content_growth.map(item => item.count),
                borderColor: '#E50914',
                backgroundColor: 'rgba(229, 9, 20, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: 'white' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y.toLocaleString()} titles added in ${context.label}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });

    // Top Countries Chart (Horizontal Bar)
    const topCountriesCtx = document.getElementById('topCountriesChart').getContext('2d');
    const countries = Object.keys(overview.top_countries).slice(0, 10);
    const countryCounts = Object.values(overview.top_countries).slice(0, 10);
    
    charts.topCountries = new Chart(topCountriesCtx, {
        type: 'bar',
        data: {
            labels: countries,
            datasets: [{
                label: 'Number of Titles',
                data: countryCounts,
                backgroundColor: '#E50914',
                borderColor: '#B8070F',
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: 'white' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.x.toLocaleString()} titles from ${context.label}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    beginAtZero: true,
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });

    // Type Distribution Chart (Doughnut)
    const typeDistributionCtx = document.getElementById('typeDistributionChart').getContext('2d');
    charts.typeDistribution = new Chart(typeDistributionCtx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(overview.type_distribution),
            datasets: [{
                data: Object.values(overview.type_distribution).map(val => (val * 100).toFixed(1)),
                backgroundColor: ['#E50914', '#FF6B6B'],
                borderColor: ['#B8070F', '#FF5252'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: 'white' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            }
        }
    });
}

// Render deep dive charts
function renderDeepDiveCharts() {
    const deepDive = dashboardData.deepDive;

    // Ratings Distribution Chart
    const ratingsCtx = document.getElementById('ratingsChart').getContext('2d');
    charts.ratings = new Chart(ratingsCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(deepDive.ratings_distribution),
            datasets: [{
                label: 'Number of Titles',
                data: Object.values(deepDive.ratings_distribution),
                backgroundColor: '#E50914',
                borderColor: '#B8070F',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: 'white' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y.toLocaleString()} titles rated ${context.label}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: 'white', maxRotation: 45 },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });

    // Duration Scatter Plot
    const durationCtx = document.getElementById('durationChart').getContext('2d');
    charts.duration = new Chart(durationCtx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Movie Duration',
                data: deepDive.duration_data.map(item => ({
                    x: item.release_year,
                    y: item.duration_minutes,
                    title: item.title
                })),
                backgroundColor: 'rgba(229, 9, 20, 0.6)',
                borderColor: '#E50914',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: 'white' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const point = context.raw;
                            return [`Title: ${point.title}`, `Year: ${point.x}`, `Duration: ${point.y} minutes`];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Duration (minutes)',
                        color: 'white'
                    },
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Release Year',
                        color: 'white'
                    },
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });

    // Genre Chart
    const genreCtx = document.getElementById('genreChart').getContext('2d');
    const genres = Object.keys(deepDive.genre_counts).slice(0, 10);
    const genreCounts = Object.values(deepDive.genre_counts).slice(0, 10);
    
    charts.genre = new Chart(genreCtx, {
        type: 'bar',
        data: {
            labels: genres,
            datasets: [{
                label: 'Number of Titles',
                data: genreCounts,
                backgroundColor: '#E50914',
                borderColor: '#B8070F',
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: 'white' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.x.toLocaleString()} titles in ${context.label}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    beginAtZero: true,
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });

    // Country-Year Bubble Chart (simplified as scatter)
    const countryYearCtx = document.getElementById('countryYearChart').getContext('2d');
    const countryYearData = deepDive.country_year_data.slice(0, 50); // Limit for performance
    
    charts.countryYear = new Chart(countryYearCtx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Content by Country & Year',
                data: countryYearData.map(item => ({
                    x: item.year_added,
                    y: item.country,
                    count: item.count
                })),
                backgroundColor: 'rgba(229, 9, 20, 0.6)',
                borderColor: '#E50914',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: 'white' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const point = context.raw;
                            return [`Country: ${point.y}`, `Year: ${point.x}`, `Titles: ${point.count}`];
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'category',
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

// Render storytelling charts
function renderStorytellingCharts() {
    const storytelling = dashboardData.storytelling;

    // Trend Chart (Line)
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    charts.trend = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: storytelling.trend_data.map(item => item.year),
            datasets: [
                {
                    label: 'Movies',
                    data: storytelling.trend_data.map(item => item.movies),
                    borderColor: '#E50914',
                    backgroundColor: 'rgba(229, 9, 20, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'TV Shows',
                    data: storytelling.trend_data.map(item => item.tv_shows),
                    borderColor: '#FF6B6B',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: 'white' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} titles in ${context.label}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });

    // Post-2017 Genres Chart
    const post2017GenresCtx = document.getElementById('post2017GenresChart').getContext('2d');
    const post2017Genres = Object.keys(storytelling.post_2017_genres).slice(0, 8);
    const post2017GenreCounts = Object.values(storytelling.post_2017_genres).slice(0, 8);
    
    charts.post2017Genres = new Chart(post2017GenresCtx, {
        type: 'bar',
        data: {
            labels: post2017Genres,
            datasets: [{
                label: 'Number of Titles',
                data: post2017GenreCounts,
                backgroundColor: '#E50914',
                borderColor: '#B8070F',
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: 'white' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.x.toLocaleString()} titles (Post-2017)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    beginAtZero: true,
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });

    // Post-2017 Ratings Chart
    const post2017RatingsCtx = document.getElementById('post2017RatingsChart').getContext('2d');
    charts.post2017Ratings = new Chart(post2017RatingsCtx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(storytelling.post_2017_ratings),
            datasets: [{
                data: Object.values(storytelling.post_2017_ratings),
                backgroundColor: [
                    '#E50914', '#FF6B6B', '#FF8A80', '#FFAB91', 
                    '#FFCC80', '#FFF176', '#AED581', '#81C784'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: 'white' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed.toLocaleString()} titles`;
                        }
                    }
                }
            }
        }
    });

    // Percentage Chart (Area)
    const percentageCtx = document.getElementById('percentageChart').getContext('2d');
    charts.percentage = new Chart(percentageCtx, {
        type: 'line',
        data: {
            labels: storytelling.percentage_data.map(item => item.year),
            datasets: [
                {
                    label: 'Movies %',
                    data: storytelling.percentage_data.map(item => item.movie_percentage),
                    borderColor: '#E50914',
                    backgroundColor: 'rgba(229, 9, 20, 0.3)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'TV Shows %',
                    data: storytelling.percentage_data.map(item => item.tv_show_percentage),
                    borderColor: '#FF6B6B',
                    backgroundColor: 'rgba(255, 107, 107, 0.3)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: 'white' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}% in ${context.label}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { 
                        color: 'white',
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

