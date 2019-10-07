# PlusForta Developer tools

Contains developer tools that all plusforta developers should have.

At present that consists of a single docker compose file that starts

* [Traefik](https://traefik.io/)
* [MariaDB](https://mariadb.org/)
* [Redis](https://redis.io/)
* [memcached](https://memcached.org/)
* [MailHog](https://github.com/mailhog/MailHog)


## Traefik
Binds to localhost on 80, 443 (HTTP/HTTPS) and 8082 (Traefik admin)
Containers wishing to use traefik should connect to the web docker network and set 
the following labels:

        labels:
          traefik.enable: true
          traefik.frontend.rule: 'Host:kf-local.pfdev.de'
          traefik.port: 80
          traefik.frontend.passHostHeader: true
 
Traefik will then pass traffic that it receives matching those [rules](https://docs.traefik.io/v1.3/basics/#frontends) to that container on the port defined by traefik.port.

The above example sends all traffic on the kf-local.pfdev.de domain to that container on port 80.
 
          
          
