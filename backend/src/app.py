from flask import Flask, render_template, redirect, request, flash, url_for, session, abort, jsonify, send_file

from dotenv import load_dotenv
import os
from flask_cors import CORS


#.env variaveis
load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
CLIENT_ID = os.getenv('CLIENT_ID')

#configurações app
app = Flask(__name__) 
#app.config.from_object(Config) 
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/')
def index():
    return 'Index Page'

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
