from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load movie data and similarity matrix
movies_dict = pickle.load(open('movies_dict.pkl', 'rb'))
movies = pd.DataFrame(movies_dict)
similarity = pickle.load(open('similarity.pkl', 'rb'))

# Fetch movie poster from TMDB API
def fetch_poster(movie_id):
    response = requests.get(f'http://api.themoviedb.org/3/movie/{movie_id}?api_key=e8b66df9c0f771046c0cb5c55490a979&language=en-US')
    data = response.json()
    return "http://image.tmdb.org/t/p/w500/" + data.get('poster_path', '')

# Recommender function
def recommend(movie):
    movie_index = movies[movies['title'] == movie].index[0]
    distances = similarity[movie_index]
    movies_numbered_with_distance = list(enumerate(distances))
    sorted_dists = sorted(movies_numbered_with_distance, reverse=True, key=lambda x: x[1])
    movies_list = sorted_dists[1:6]  # Start from 1 to exclude the movie itself

    recommended_movies = []
    for i in movies_list:
        movie_id = movies.iloc[i[0]].movie_id
        movie_title = movies.iloc[i[0]].title
        movie_poster_url = fetch_poster(movie_id)
        recommended_movies.append({"title": movie_title, "poster_url": movie_poster_url})
    
    return recommended_movies

@app.route('/recommend', methods=['POST'])
def recommend_movies():
    data = request.get_json()
    movie_name = data['movie']
    recommendations = recommend(movie_name)
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True)