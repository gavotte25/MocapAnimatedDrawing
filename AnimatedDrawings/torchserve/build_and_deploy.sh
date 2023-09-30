#!/usr/bin/env bash

docker build -t docker_torchserve .

docker run --net mocapani --ip 172.18.0.3 -d --name docker_torchserve --memory="6g" -p 8080:8080 -p 8081:8081 docker_torchserve