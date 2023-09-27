#!/usr/bin/env bash
# TODO: remove sleep infinity, docker container exec
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"
cd ..
cd SharedVolume/
SHAREDVOL=`pwd`

cd "$DIR"

NAME="animated_drawings"
dockerfile_pth="$DIR"
mount_pth="$SHAREDVOL"

# docker pull ubuntu:18.04
# docker build \
# 	-t $NAME \
# 	$dockerfile_pth \
# 	--build-arg user_id=$UID

docker run -d \
	-it \
	-p 1025:1025 \
	--name $NAME \
	-v $mount_pth:/SharedVolume \
	$NAME \
	sleep infinity

docker ps -a

OUR_DOCKER_ID=`docker ps -a | grep $NAME | cut -f1 -d' '`
echo "Our docker ID is : $OUR_DOCKER_ID"
echo "Attaching it using : docker attach $OUR_DOCKER_ID"
# docker attach $OUR_DOCKER_ID
docker container exec -it $OUR_DOCKER_ID /bin/bash

exit 0
