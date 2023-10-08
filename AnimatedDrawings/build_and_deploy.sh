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

docker pull ubuntu:18.04
docker build \
	--platform linux/x86_64 \
	-t $NAME \
	$dockerfile_pth \
	--build-arg user_id=$UID

docker run -d \
	-it \
	--net mocapani \
	--ip 172.18.0.2 \
	-p 1025:1025 \
	-p 1026:1026 \
	--name $NAME \
	-v $mount_pth:/SharedVolume \
	$NAME

docker ps -a

OUR_DOCKER_ID=`docker ps -a | grep $NAME | cut -f1 -d' '`
echo "Our docker ID is : $OUR_DOCKER_ID"

exit 0
