FROM tensorflow/tensorflow:latest-gpu

RUN \
	echo "**** packages installation ****" \
		&& apt-key adv --fetch-keys http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1604/x86_64/3bf863cc.pub \
		&& apt-get update && apt-get install -y \
			vim \
            build-essential \
            cmake \
            libopencv-dev \
            libjpeg-dev \
            libpng-dev \
            libglew-dev \
            libpthread-stubs0-dev \
			git \
			virtualenv \
			time \
			sudo \
			wget \
			nano \
	&& echo "**** python pip update ****" \
		&& /usr/bin/python3 -m pip install --upgrade pip \
	&& echo "**** aliases for l and ll commands creation ****" \
		&& echo -e 'ls --color=auto "$@"' > /usr/bin/l \
		&& echo -e 'ls -lah --color=auto "$@"' > /usr/bin/ll \
    	&& chmod +x /usr/bin/ll /usr/bin/l \
	&& echo "**** history-search-backward by pressing F8 ****" \
		&& sed -i 's/# "\\e\[5~": history-search-backward/"\\e\[19~": history-search-backward/' /etc/inputrc

RUN apt-get install -y python3-venv
RUN pip install --ignore-installed Flask
COPY . /MocapNET
RUN cd MocapNET && ./initialize.sh --collab
WORKDIR /MocapNET
CMD python app.py