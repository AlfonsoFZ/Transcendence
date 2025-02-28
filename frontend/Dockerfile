FROM node:lts-bookworm

RUN apt update && apt -y install lighttpd

COPY ./conf/lighttpd.conf /etc/lighttpd/lighttpd.conf

RUN mkdir /src/

COPY ./src/ /src

WORKDIR /src/src

RUN npm install

EXPOSE 3000

CMD ["lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]
