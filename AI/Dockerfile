FROM python:3.7
COPY . .

RUN chmod 777 /tmp
RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["python","src/app.py"]