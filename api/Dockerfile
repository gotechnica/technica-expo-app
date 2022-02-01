FROM python:3.6

ADD . /app

WORKDIR /app

COPY requirements.txt /tmp/
RUN pip install --requirement /tmp/requirements.txt
RUN pip install gunicorn

EXPOSE 8000