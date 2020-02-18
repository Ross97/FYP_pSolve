FROM ubuntu:18.04

MAINTAINER Ross Phelan "rossphelan97@gmail.com"

RUN apt-get -y update && apt-get -y upgrade && \
	apt-get -y install libsm6 libxrender1 libfontconfig1 libxext6 ffmpeg && \
    apt-get -y install python3 python3-dev python3-setuptools python3-pip

RUN mkdir -p /psolve_server
WORKDIR /psolve_server

COPY requirements.txt ./requirements.txt
RUN pip3 install -r requirements.txt

COPY psolve/ ./

CMD [ "python3", "server.py" ]