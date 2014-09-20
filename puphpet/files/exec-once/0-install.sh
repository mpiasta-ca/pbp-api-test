#!/bin/bash
sudo npm install pm2 -g --unsafe-perm 2&>1 >/dev/null
sudo npm install sails -g 2&>1 >/dev/null
sudo npm install grunt-cli -g 2&>1 >/dev/null
cd /var/www/app && sudo npm install 2&>1 >/dev/null