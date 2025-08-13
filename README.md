# Netflix Content Analysis Dashboard

An interactive web-based dashboard that transforms Netflix's content data into actionable insights, revealing key trends, changing audience preferences, and shifts in Netflix's content strategy.

## Features

### 📊 Overview Dashboard
- **Total Movies & TV Shows** - Breakdown by type with interactive hover tooltips
- **Content Growth Over Time** - Titles added each year with trend visualization
- **Top Countries** - Leading content producers with detailed statistics
- **Type Distribution** - Movies vs TV Shows share with percentage breakdown

### 🔍 Deep Dive Dashboard
- **Interactive Filters** - Year, Type, Country, Rating, Genre
- **Ratings Distribution** - Audience targeting trends with hover insights
- **Movie Duration vs Release Year** - Scatter plot showing duration trends with title details
- **Genre Breakdown** - Popular genres with count information
- **Country-Year Analysis** - Content distribution by country and year

### 📈 Storytelling Dashboard
- **TV Shows vs Movies Trend** - Content strategy shift with 2017 turning point highlighted
- **Post-2017 Genres** - Top genres after the strategic shift
- **Post-2017 Ratings** - Content targeting patterns after 2017
- **Strategic Shift Percentage** - Content type distribution over time
- **Key Insights** - Annotated insights highlighting Netflix's strategic changes

## Technology Stack

- **Backend**: Python Flask with RESTful API endpoints
- **Frontend**: HTML5, CSS3, JavaScript with Chart.js for interactive visualizations
- **Data Processing**: Pandas for data analysis and transformation
- **Styling**: Custom Netflix-themed CSS with responsive design
- **Charts**: Chart.js with hover tooltips and interactive features

## Interactive Features

- **Hover Tooltips**: All charts provide detailed information on hover
- **Tab Navigation**: Seamless switching between dashboard views
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Data**: Backend API serves processed Netflix data
- **Visual Storytelling**: Annotations and insights highlight key trends

## Setup Instructions

### Prerequisites
- Python 3.11 or higher
- pip (Python package installer)

### Installation

1. **Extract the project files**
   ```bash
   unzip Netflix-Content-Analysis-Interatctive-Dashboard-Data-Science-Project.zip
   cd Netflix-Content-Analysis-Interatctive-Dashboard-Data-Science-Project
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python src/main.py
   ```

5. **Access the dashboard**
   Open your web browser and go to: `http://localhost:5000`

## API Endpoints

The Flask backend provides the following API endpoints:

- `GET /api/netflix/stats` - General statistics
- `GET /api/netflix/overview` - Overview dashboard data
- `GET /api/netflix/deep-dive` - Deep dive dashboard data
- `GET /api/netflix/storytelling` - Storytelling dashboard data

## Project Structure

```
Netflix-Content-Analysis-Interatctive-Dashboard-Data-Science-Project/
├── src/
│   ├── main.py                 # Flask application entry point
│   ├── routes/
│   │   ├── netflix_data.py     # Netflix data API routes
│   │   └── user.py             # User management routes
│   ├── models/
│   │   └── user.py             # Database models
│   ├── static/
│   │   ├── index.html          # Main dashboard HTML
│   │   ├── styles.css          # Netflix-themed CSS
│   │   ├── script.js           # Interactive JavaScript
│   │   └── favicon.ico         # Site icon
│   └── netflix_titles_cleaned.csv  # Processed Netflix data
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## Key Insights Revealed

### 🔄 Strategic Pivot in 2017
Netflix significantly increased TV show production after 2017, shifting from a movie-heavy catalog to a more balanced content strategy.

### 🌍 Global Content Expansion
The platform expanded beyond US content, with significant investments in international productions, particularly from India, UK, and South Korea.

### 🎯 Audience Targeting
Netflix maintains a focus on mature content (TV-MA) while diversifying across all age groups to capture broader market segments.

## Skills Demonstrated

- **Data Cleaning & Preparation** - Processing raw Netflix data
- **Advanced Visualizations** - Interactive charts with Chart.js
- **Data Storytelling** - Annotations and narrative insights
- **Full-Stack Development** - Flask backend + HTML/CSS/JS frontend
- **API Design** - RESTful endpoints for data access
- **Responsive Design** - Mobile-friendly interface

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the port in `src/main.py` from 5000 to another port (e.g., 5001)

2. **Module not found errors**
   - Ensure virtual environment is activated
   - Run `pip install -r requirements.txt` again

3. **Charts not loading**
   - Check browser console for JavaScript errors
   - Ensure Flask server is running and accessible

### Support

If you encounter any issues, please check:
1. Python version compatibility (3.11+)
2. Virtual environment activation
3. All dependencies installed correctly
4. Flask server running without errors

## License

This project is for educational and demonstration purposes.


Linkdin https://www.linkedin.com/in/mussa-khan-49b784375/Github 
Github https://github.com/musagithub1
