FROM debian:bookworm

RUN apt update && apt -y install lighttpd

COPY ./conf/lighttpd.conf /etc/lighttpd/lighttpd.conf

RUN mkdir /front/

COPY ./front /front

EXPOSE 3000

CMD ["lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]
