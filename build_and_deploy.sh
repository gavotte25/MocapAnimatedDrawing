#!/bin/bash
docker network create --subnet=172.18.0.0/16 mocapani
cd AnimatedDrawings
sh build_and_deploy.sh
cd torchserve
sh build_and_deploy.sh
cd ../../MocapNET
sh build_and_deploy.sh