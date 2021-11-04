#!/bin/bash

if [ -d /home/ubuntu/test-helper ]
then
    echo "Directory /home/ubuntu/test-helper exists. delete start!" 
    rm -rf /home/ubuntu/test-helper 
fi