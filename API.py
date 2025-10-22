# app.py - Flask бэкэнд для ВаджыЦыфры
from flask import Flask, render_template, jsonify, request
import random

app = Flask(__name__)

# Зменныя для гульні
game_sessions = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/status')
def api_status():
    return jsonify({
        'status': 'актыўны',
        'message': 'ВаджыЦыфры API працуе!'
    })

@app.route('/api/start_game', methods=['POST'])
def start_game():
    session_id = request.json.get('session_id', 'default')
    
    game_sessions[session_id] = {
        'random_number': random.randint(1, 100),
        'attempts': 0,
        'max_attempts': 10,
        'guesses': [],
        'game_over': False
    }
    
    return jsonify({
        'message': 'Гульня пачалася! Адгадайце лічбу ад 1 да 100.',
        'max_attempts': 10
    })

@app.route('/api/guess', methods=['POST'])
def make_guess():
    session_id = request.json.get('session_id', 'default')
    guess = request.json.get('guess')
    
    if session_id not in game_sessions:
        return jsonify({'error': 'Гульня не знойдзена'}), 404
    
    game = game_sessions[session_id]
    
    if game['game_over']:
        return jsonify({'error': 'Гульня скончана'}), 400
    
    try:
        guess_num = int(guess)
        if guess_num < 1 or guess_num > 100:
            return jsonify({'error': 'Лічба павінна быць ад 1 да 100'}), 400
    except ValueError:
        return jsonify({'error': 'Калі ласка, увядзіце цэлы лік'}), 400
    
    game['attempts'] += 1
    game['guesses'].append(guess_num)
    
    if guess_num == game['random_number']:
        game['game_over'] = True
        return jsonify({
            'result': 'win',
            'message': f'🎉 Віншуем! Вы адгадалі за {game["attempts"]} спроб!',
            'attempts': game['attempts']
        })
    elif game['attempts'] >= game['max_attempts']:
        game['game_over'] = True
        return jsonify({
            'result': 'lose',
            'message': f'На жаль, вы не адгадалі. Правільны адказ: {game["random_number"]}',
            'correct_number': game['random_number']
        })
    else:
        if guess_num < game['random_number']:
            hint = 'Занадта нізка! Паспрабуйце большую лічбу.'
        else:
            hint = 'Занадта высока! Паспрабуйце меншую лічбу.'
        
        return jsonify({
            'result': 'continue',
            'hint': hint,
            'attempts_left': game['max_attempts'] - game['attempts'],
            'previous_guesses': game['guesses']
        })

if __name__ == '__main__':
    app.run(debug=True)
