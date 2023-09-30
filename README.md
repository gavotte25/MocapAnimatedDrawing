# MocapAnimatedDrawing
Current tensorflow version is not compatible with CUDA 12
https://github.com/FORTH-ModelBasedTracker/MocapNET/issues/101

If build docker on M1 and encounter "/lib64/ld-linux-x86-64.so.2: No such file or directory error", use this 
docker run --platform linux/x86_64 <image>

docker run -d -it --net mocapani --ip 172.18.0.2 -p 1025:1025 --name animated_drawings -v /home/gavotte25/MocapAnimatedDrawing/SharedVolume:/SharedVolume animated_drawings sleep infinity

## Upper Limbs
LeftShoulder    lshoulder
RightShoulder   rshoulder

LeftElbow       lelbow
RightElbow      relbow

LeftWrist       lhand
RightWrist      rhand

LFingers        metacarpal3.l
RFingers        metacarpal3.r

## Lower Limbs

LeftHip         lhip
RightHip        rhip

LeftKnee        lknee
RightKnee       rknee

LeftAnkle       lfoot
RightAnkle      rfoot

LeftToe         LeftToeBase
RightToe        RightToeBase

## Trunk

Hips            hip
Chest           abdomen
Chest2          chest
Head            Head