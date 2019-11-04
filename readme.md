# PlusForta Developer tools

Contains common servers that are shared between the various development projects)

At present it consists of a single docker compose file that starts

* [Traefik](https://traefik.io/) with [Jaeger](https://www.jaegertracing.io/)
* [MariaDB](https://mariadb.org/)
* [Redis](https://redis.io/)
* [memcached](https://memcached.org/)
* [MailHog](https://github.com/mailhog/MailHog)

## Getting started

Before you start, make sure nothing is listening on ports 80, 443, and 8082.

* Set up your own .env file.
    * Copy .env.example to .env
    * Add your AWS Access Key and Secret to the ```.env``` file (**NEVER** TO THE ```.env.example``` file) 
* Start the services 

       docker-compose up -d

Now you can start services in your projects..

## Traefik

Binds to localhost on 80, 443 (HTTP/HTTPS) and 8082 (Traefik admin)
Containers wishing to use traefik should connect to the web docker network and set 
the following labels:

        labels:
          - "traefik.enable: true"
          - "traefik.http.routers.service.rule=Host('service.pfdev.de')"
          - "traefik.http.routers.service.entrypoints=websecure"
          - "traefik.http.routers.service.tls.certresolver=default"
          
Traefik will then pass traffic that it receives matching those [rules](https://docs.traefik.io/routing/routers/)

The above example sends all traffic on the service.pfdev.de domain to that container on port 443.

Cavets: 
* In order for traefik to function, you will need to configure the .env file with your AWS API Key/Secret.
* Your container must be in the web network

**All hostnames must be in the pfdev.de domain**
 
## MariaDB

MariaDB (aka MySQL) is available to other containers at mariadb.internal on port 3306.
From the host system,  port 3316 also reaches the server.  username: root, password: root

## MemcacheD

MemcacheD is available at memcached.internal on port 11211.  It's available to the host on port 22122.

## mailhog

Mailhog is a server that accepts SMTP on port 1025 (host mailhog.internal). 
You can view any received emails on http://localhost:8025

**Note:**  You will need to configure your application to use mailhog, it doesn't intercept traffic on it's own.

## redis

Redis provides a redis instance on redis.internal on port 6379.   It is also available on the host on port 6380.

# Setting up the project docker-compose.yml file

In your project docker-compose, you will need to define the external networks as follows:

    networks:
      web: # defines the network used to connect to traefik in another container
        external:
          name: web
      internal: # defines the network used to connect to all services
          external:
            name: internal
            
Add labels (as shown above) for each container that you wish to access securely via traefik. 
