# Main server file
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return "Hello World!"

# Database CRUD routes



# Public CRUD routes



# Private CRUD routes




if __name__ == '__main__':
    app.run()