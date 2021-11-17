#!/bin/bash

if [ -d docker-compose.yml ]; then
    docker-compose up --build
fi