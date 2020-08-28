# Error Pages

## Overview

In this directory you will find the source and build tools for use
with traefik.

Presently, it only shows a single page if traefik receives a request
that it doesn't know what to do with.

### conf directory

This directory gets volume mounted into /etc/nginx/conf.d and
therfore contains nginx config files. (Shocking!)

At present it contains the config for the catchall page.
In the future we can create additional servers for all the
typo sites that will direct to the main sites. 
e.g. kautionfrei.de -> kautionsfrei.de

### html directory

This directory gets mounted into /usr/share/nginx/html and
is therefore the webroot.

### src

Contains the CSS files for the page.

##  Building the project 

This project uses [yarn](https://yarnpkg.com/) and [gulp](https://gulpjs.com/).

Install those two npm modules, then run:

`yarn install`

after that you can develop locally with:

`gulp watch`

Which will automatically rebuild the styles.css file.

**Make sure to build the production css with `NODE_ENV=production gulp css` and then
check in the resulting file (html/css/styles.css).**

This project uses tailwind CSS which is great. **NOTE**:it generates
a massive CSS blob if you don't add the NODE_ENV=production, so
don't forget to do that!


