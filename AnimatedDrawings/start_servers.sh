#!/usr/bin/env bash
conda run -n animated_drawings python app.py &
cd examples
conda run -n animated_drawings python fix_annotations.py ../../SharedVolume/Annotation