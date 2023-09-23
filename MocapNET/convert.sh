INPUT="../SharedVolume/$*"
echo $INPUT

if [ -f ../SharedVolume/out.bvh ]
then
rm ../SharedVolume/out.bvh
fi
./MocapNET2LiveWebcamDemo --from $INPUT --openpose --novisualization
./GroundTruthDumper --from dependencies/RGBDAcquisition/opengl_acquisition_shared_library/opengl_depth_and_color_renderer/Motions/DAZFriendlyCGSPEED_ZXYAndHandsAxisBigHands.bvh --merge out.bvh dependencies/RGBDAcquisition/opengl_acquisition_shared_library/opengl_depth_and_color_renderer/Motions//mergeDazFriendlyAndAddHead.profile --setPositionRotation 0 0 0 0 0 0 --bvh ../SharedVolume/out.bvh
if [ -f ../SharedVolume/out.bvh ]
then
exit 0
else
exit 1
fi