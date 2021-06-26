# PlusForta Developer tools

Contains common servers that are shared between the various development projects)

At present it consists of a single docker compose file that starts

* [Traefik](https://traefik.io/)
* [MySQL](https://hub.docker.com/_/mysql)
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
          - traefik.enable=true
          - traefik.http.routers.routerName.rule=Host("foo.local.pfdev.de")
          - traefik.http.routers.routerName.entrypoints=websecure
          - traefik.http.routers.routerName.tls.certresolver=default
          - traefik.http.services.serviceName.loadbalancer.server.port=80"

          
Traefik will then pass traffic that it receives matching those [rules](https://docs.traefik.io/routing/routers/)

The above example directs all requests for https://foo.local.pfdev.de URL to this container on port 80.

Specifically what we're are doing is creating a traefik "router" that answers all requests on port 443 with
the hostname of `foo.local.pfdev.de`.  This router is called routerName.   This router will generate SSL certificates
on demand based on the configuration "default". (This is configured in the traefik.yml file.)

Additionally, we are creating a service called serviceName which will take the requests received by the router and forward
them to the container on port 80.

`request --->  https to traefik ---> http to container`

The names 'routerName' and 'serviceName' in the labels should be adjusted for your project as they must be unique for the
traefik instance.  

For example:

```traefik.http.routers.erp.rule=Host("local.aareal-aval.de") || Host("aval.pfdev.de")```

Note: You also need to make sure that service.pfdev.de resolves to 127.0.0.1 in or add a local hosts entry.
ProTip: *.local.pfdev.de resolves to 127.0.0.1, so any foo.local.pfdev.de domain will automatically resolve to your
local computer.

Caveats: 
* In order for traefik to function, you will need to configure the .env file with your AWS API Key/Secret.
* Your container must be on the web network

## About the internal network

docker has it's own networking system that can be used for one container to access another container.  
It is in this networking system that we have created a network called ```internal```.  Other containers,
as long as the internal network has been declared to them, can access these containers on this network.

The hostname to access the container is <container name>.internal.    The host machine (your computer)
can't access this internal network, therefore we have additionally made available the services on the
localhost (127.0.0.1) address.   Usually on a port different than the "standard" port to avoid conflicts
with any existing services.
 
## MySQL

MySQL v8 is available to other containers at `db.internal` on port 3306.
From the _host_ system,  port 3316 also reaches the server.  username: root, password: root

## Adminer

Adminer is a web base MySQL client.  It's accessible at https://db.local.pfdev.de.  Use the following values
to connect:

| Field | Value |
|-------|-------|
| Server | db.internal |
| Username | root |
| Password | root |
| Database | leave blank for all, or put your database name in to start there |

## Memcached

MemcacheD is available at `memcached.internal` on port 11211 to other containers.  It's available to the host on port 22122.

## Mailhog

Mailhog is a server that accepts SMTP on port 1025 (host `mailhog.internal`). 
You can view any sent emails on https://mail.local.pfdev.de

**Note:**  You will need to configure your application to use mailhog, it doesn't intercept traffic on it's own.

For symfony projects, add the following to .env.local
`MAILER_DSN=smtp://mailhog.internal:1025`

## Redis

The Redis container provides a redis instance on redis.internal on port 6379.   It is also available on the host on port 6380.


## RabbitMq 

RabbitMQ web management interface is available at https://mq.local.pfdev.de (username: guest, password: guest).
For other containers, it's accessible as `rabbitmq-messenger`

# Setting up the project docker-compose.yml file

In order to access these services in your project's docker-compose.yml, you will need to define the external networks as follows:

    networks:
      web: # defines the network used to connect to traefik your container
        external:
          name: web
      internal: # defines the network used to connect to all services
          external:
            name: internal
            
Add labels (as shown above) for each container that you wish to access securely via traefik. 

# DNS workaround

If you can't add a hostname to your public DNS server, you can also add an entry to your
local hosts file.    (Note, this is becoming increasingly less likely to work with DNS over HTTPS and
browser developers ignoring system hostname resolution)

    sudo nano /etc/hosts
    Add a line that says:
    127.0.0.1 [service].pfdev.de
    
Where [service] is the hostname you want to use.
