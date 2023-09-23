#!/usr/bin/env bash
# This script builds and runs a docker image for local use.

#Although I dislike the use of docker for a myriad of reasons, due needing it to deploy on a particular machine
#I am adding a docker container builder for the repository to automate the process


DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"
cd ..
cd SharedVolume/
SHAREDVOL=`pwd`

cd "$DIR"

NAME="mocapnet"
dockerfile_pth="$DIR"
mount_pth="$SHAREDVOL"

# update tensorflow image
docker pull tensorflow/tensorflow:latest-gpu

# build and run tensorflow
docker build \
	-t $NAME \
	$dockerfile_pth \
	--build-arg user_id=$UID

docker run -d \
	--gpus all \
	--shm-size 8G \
	-it \
	-p 1024:1024 \
	--name $NAME \
	-v $mount_pth:/home/user/workspace/SharedVolume \
	$NAME


docker ps -a

OUR_DOCKER_ID=`docker ps -a | grep mocapnet | cut -f1 -d' '`
echo "Our docker ID is : $OUR_DOCKER_ID"
echo "Attaching it using : docker attach $OUR_DOCKER_ID"
docker attach $OUR_DOCKER_ID

exit 0
