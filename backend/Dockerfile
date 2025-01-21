FROM debian:bookworm

# install python3, libpq dependency for psycopg2, venv and postgres client
RUN apt update -y && apt install -y -qqy libpq-dev python3-pip python3-venv postgresql-client

# create a virtual env (mandatory with debian:bookworm)
RUN python3 -m venv /opt/venv

# env for venv
ENV PATH="/opt/venv/bin:$PATH"

RUN mkdir /app

COPY . /app/

RUN chmod +x /app/init.sh

WORKDIR /app

EXPOSE 8000

ENTRYPOINT [ "./init.sh" ]
