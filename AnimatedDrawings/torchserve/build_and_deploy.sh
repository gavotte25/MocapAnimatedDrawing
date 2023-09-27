#!/usr/bin/env bash

docker build -t docker_torchserve .

docker run -d --name docker_torchserve --memory="6g" -p 8080:8080 -p 8081:8081 docker_torchserve