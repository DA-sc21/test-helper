#!/bin/bash

cd /home/ubuntu/
git clone https://github.com/DA-sc21/test-helper.git
cd test-helper
sudo chmod 777 docker-compose.yml
sudo chmod 777 backend/testhelper/src/main/resources/application.yml