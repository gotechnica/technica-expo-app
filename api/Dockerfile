From python:3

ADD . /app

WORKDIR /app

RUN pip install -r requirements.txt
RUN pip install gunicorn

EXPOSE 8000

# startup scripts
CMD ["gunicorn", "-b", "0.0.0.0:8000", "server:app"]
