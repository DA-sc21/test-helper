#!/bin/bash

cd /home/ubuntu/
git clone https://github.com/DA-sc21/test-helper.git
cd test-helper
cd backend/testhelper
chmod +x gradlew
sudo ./gradlew clean
sudo ./gradlew jar