INPUT="../SharedVolume/Temp/$*"
echo $INPUT

if [ -f ../SharedVolume/Temp/out.bvh ]
then
rm ../SharedVolume/Temp/out.bvh
fi
./MocapNET2LiveWebcamDemo --from $INPUT --novisualization --noik --forth
./GroundTruthDumper --from dependencies/RGBDAcquisition/opengl_acquisition_shared_library/opengl_depth_and_color_renderer/Motions/DAZFriendlyCGSPEED_ZXYAndHandsAxisBigHands.bvh --merge out.bvh dependencies/RGBDAcquisition/opengl_acquisition_shared_library/opengl_depth_and_color_renderer/Motions//mergeDazFriendlyAndAddHead.profile --setPositionRotation 0 -180 0 0 0 0 --bvh ../SharedVolume/Temp/out.bvh
# Below command convert bvh to different format, without stabilization
# ./GroundTruthDumper --from dependencies/RGBDAcquisition/opengl_acquisition_shared_library/opengl_depth_and_color_renderer/Motions/02_03.bvh --merge out.bvh dependencies/RGBDAcquisition/opengl_acquisition_shared_library/opengl_depth_and_color_renderer/Motions//mergeDazFriendlyAndAddHead.profile --bvh ../SharedVolume/Temp/out.bvh
if [ -f ../SharedVolume/Temp/out.bvh ]
then
exit 0
else
exit 1
fi