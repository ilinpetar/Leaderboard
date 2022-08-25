# Huld Leaderboard

### Healthcheck
Log in to Oracle Cloud VM #1 and check the following services:

```
# sudo systemctl status leaderboard
# sudo systemctl status snapd
# sudo systemctl status httpd
```

### Technical details (things to check when it is not working)

- Apache httpd listens on port 443
- snapd (certbot) automatically generates Let's Encrypt certificates for orcl1-ilinpetar.ddns.net
- Oracle Virtual Cloud (Networking >> Virtual Cloud Networks >> Virtual Cloud Network Details >> Security Lists) needs to have Ingress rules for port 443