#!/bin/bash

if [ -d docker-compose.yml ]; then
    docker-compose --env-file ./profile-prod.txt up --build
fi