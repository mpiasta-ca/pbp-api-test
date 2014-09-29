# Homework Exercise

This is an example app to demonstrate my programming skills. Uses AngularJS, Bootstrap, node.js, and makes calls with the Yelp API.

### Pre-Requisites

Need to have Vagrant and VirtualBox installed on your computer. These programs will automate the setup process for the required Ubuntu/node.js environment.

1. [Download and install VirtualBox](https://www.virtualbox.org/wiki/Downloads)

2. [Download and install Vagrant](https://www.vagrantup.com/downloads.html)

### Initial Use

For the first use, vagrant will go through a 3-5 minute setup process for the environment. In a future boot, your environment will launch much faster. Instructions:

1. Download git repo into a local folder on your computer.

2. Enter your [Yelp API](http://www.yelp.com/developers/manage_api_keys) key in `/api/config/connections.js` (lines 26 to 29).

3. Open "Terminal" (Mac), or "Windows Powershell" (Windows; make sure to "Run as Administrator"), and `cd` to your git repo folder.

4. Type `vagrant up` and hit Enter.

5. Wait... (takes about 3-5 minutes)

6. Open app in your browser: [http://192.168.90.60](http://192.168.90.60). If the website appears offline, wait a few more moments, because sails.js takes about 30 seocnds to launch after `vagrant up` is completed.

### Subsequent Use

1. Open "Terminal" (Mac), or "Windows Powershell" (Windows & "Run as Administrator"), and `cd` to your git repo folder.

2. Type `vagrant up` and hit Enter.

4. Wait... (about 30 seconds)

5. Open app in your browser: [http://192.168.90.60](http://192.168.90.60). If the website appears offline, wait a few more moments, because sails.js takes about 30 seocnds to launch after `vagrant up` is completed.
