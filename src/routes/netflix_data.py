import pandas as pd
import os
from flask import Blueprint, jsonify
from flask_cors import cross_origin

netflix_bp = Blueprint('netflix', __name__)

# Load the data once when the module is imported
DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'netflix_titles_cleaned.csv')
df = pd.read_csv(DATA_PATH)
df['date_added'] = pd.to_datetime(df['date_added'])
df['year_added'] = df['date_added'].dt.year

@netflix_bp.route('/overview', methods=['GET'])
@cross_origin()
def get_overview_data():
    """Get data for overview dashboard"""
    
    # Total content by type
    content_by_type = df['type'].value_counts().to_dict()
    
    # Content growth over time
    content_growth = df.groupby('year_added').size().reset_index(name='count')
    content_growth_data = content_growth.to_dict('records')
    
    # Top countries
    top_countries = df['country'].value_counts().head(10).to_dict()
    
    # Type distribution
    type_distribution = df['type'].value_counts(normalize=True).round(3).to_dict()
    
    # Releases by year
    releases_by_year = df['release_year'].value_counts().sort_index().to_dict()
    
    return jsonify({
        'content_by_type': content_by_type,
        'content_growth': content_growth_data,
        'top_countries': top_countries,
        'type_distribution': type_distribution,
        'releases_by_year': releases_by_year
    })

@netflix_bp.route('/deep-dive', methods=['GET'])
@cross_origin()
def get_deep_dive_data():
    """Get data for deep dive dashboard"""
    
    # Ratings distribution
    ratings_distribution = df['rating'].value_counts().to_dict()
    
    # Movie duration vs release year (for movies only)
    movies_df = df[df['type'] == 'Movie'].copy()
    movies_df['duration_minutes'] = movies_df['duration'].apply(
        lambda x: int(x.split(' ')[0]) if 'min' in str(x) else None
    )
    movies_df = movies_df.dropna(subset=['duration_minutes'])
    
    duration_data = movies_df[['release_year', 'duration_minutes', 'title']].to_dict('records')
    
    # Genre breakdown
    all_genres = df['listed_in'].str.split(', ').explode()
    genre_counts = all_genres.value_counts().head(15).to_dict()
    
    # Country-year data
    country_year_data = df.groupby(['year_added', 'country']).size().reset_index(name='count')
    country_year_data = country_year_data[country_year_data['country'].isin(
        df['country'].value_counts().head(10).index
    )].to_dict('records')
    
    return jsonify({
        'ratings_distribution': ratings_distribution,
        'duration_data': duration_data,
        'genre_counts': genre_counts,
        'country_year_data': country_year_data
    })

@netflix_bp.route('/storytelling', methods=['GET'])
@cross_origin()
def get_storytelling_data():
    """Get data for storytelling dashboard"""
    
    # TV Shows vs Movies trend over time
    content_by_year_type = df.groupby(['year_added', 'type']).size().unstack(fill_value=0)
    trend_data = []
    for year in content_by_year_type.index:
        trend_data.append({
            'year': int(year),
            'movies': int(content_by_year_type.loc[year, 'Movie']) if 'Movie' in content_by_year_type.columns else 0,
            'tv_shows': int(content_by_year_type.loc[year, 'TV Show']) if 'TV Show' in content_by_year_type.columns else 0
        })
    
    # Post-2017 data
    post_2017_df = df[df['year_added'] >= 2017]
    
    # Post-2017 genres
    post_2017_genres = post_2017_df['listed_in'].str.split(', ').explode()
    post_2017_genre_counts = post_2017_genres.value_counts().head(10).to_dict()
    
    # Post-2017 ratings
    post_2017_ratings = post_2017_df['rating'].value_counts().to_dict()
    
    # Strategic shift percentage
    content_percentage = content_by_year_type.div(content_by_year_type.sum(axis=1), axis=0) * 100
    percentage_data = []
    for year in content_percentage.index:
        percentage_data.append({
            'year': int(year),
            'movie_percentage': float(content_percentage.loc[year, 'Movie']) if 'Movie' in content_percentage.columns else 0,
            'tv_show_percentage': float(content_percentage.loc[year, 'TV Show']) if 'TV Show' in content_percentage.columns else 0
        })
    
    return jsonify({
        'trend_data': trend_data,
        'post_2017_genres': post_2017_genre_counts,
        'post_2017_ratings': post_2017_ratings,
        'percentage_data': percentage_data
    })

@netflix_bp.route('/stats', methods=['GET'])
@cross_origin()
def get_stats():
    """Get general statistics"""
    total_titles = len(df)
    total_movies = len(df[df['type'] == 'Movie'])
    total_tv_shows = len(df[df['type'] == 'TV Show'])
    countries_count = df['country'].nunique()
    date_range = {
        'earliest': df['date_added'].min().strftime('%Y-%m-%d'),
        'latest': df['date_added'].max().strftime('%Y-%m-%d')
    }
    
    return jsonify({
        'total_titles': total_titles,
        'total_movies': total_movies,
        'total_tv_shows': total_tv_shows,
        'countries_count': countries_count,
        'date_range': date_range
    })

