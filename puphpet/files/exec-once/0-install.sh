#!/bin/bash
sudo npm install pm2 -g --unsafe-perm >> /dev/null 2>&1
sudo npm install grunt-cli -g >> /dev/null 2>&1
cd /var/www/app && sudo npm install >> /dev/null 2>&1