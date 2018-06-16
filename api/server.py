# Main server file
import public
import private
import data
import db
from flask import Flask

app = Flask(__name__)
app.register_blueprint(public.bp)
app.register_blueprint(private.bp)
app.register_blueprint(data.bp)

@app.route('/')
def hello():
    return "Hello World!"

if __name__ == '__main__':
    app.run()