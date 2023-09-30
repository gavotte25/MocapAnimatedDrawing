FROM ubuntu:18.04

RUN apt-get update && apt-get install -y \
        wget \
        git \
        ffmpeg \
        libsm6 \
        libxext6 \
        python3-opengl \
        libosmesa6
ENV CONDA_DIR /opt/conda
RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh \
    && /bin/bash ~/miniconda.sh -b -p /opt/conda
ENV PATH=$CONDA_DIR/bin:$PATH
RUN conda create --name animated_drawings python=3.8.13 -y 
SHELL ["conda", "run", "-n", "animated_drawings", "/bin/bash", "-c"]
COPY . /AnimatedDrawings
RUN cd AnimatedDrawings && pip install -e .
WORKDIR /AnimatedDrawings
ENTRYPOINT ["conda", "run", "-n", "animated_drawings"]
CMD ["python", "app.py"]