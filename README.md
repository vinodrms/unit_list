# UnitPal
**Property Management System designed for Small & Medium Sized Hotels**

## Prerequisites

To run UnitPal, you need the following:
- TypeScript 2.2.1
- Npm 3.10
- Node 6.10.0
- MongoDB 3.2.6 running on the default port 27017
- Visual Studio Code (last version)
- RoboMongo (last version) - MongoDB IDE

## Running the project

### Install Dependencies

When you first clone the app, run in a terminal
```
 npm run install-deps
```
This will install all the required node modules for the client + server.

### VS Code Project's Structure

The project has 3 Visual Studio Tasks:
 - build server (Shift+Ctrl+B / Shift+Cmd+B) : this will open up a process that will continuously compile `.ts` files to `.js` whenever a change is made on the **server**
 - build client (Shift+Ctrl+T / Shift+Cmd+T) : this will open up a process that will continuously compile `.ts` files to `.js` whenever a change is made on the **client**
 - build e2e tests

The client's and the server's code is on TypeScript, and the transpiled `.js` filed are hidded in VS Code.

From the VS Code Launch commands, the next 2 are important:
- `Launch`: will open up UnitPal on the local environment on port `8001`
- `Server tests`: will run all the server tests

To run the same 2 commands outside VS Code (from the terminal):
```
npm run dev
npm run server-tests
```

### Accessing the local web app without authentication

After running the `Server tests` VS Code command, these will create a default hotel. On the development and tests environment, this user is set automatically on the session on the server. This allows you to easily go to pages that usually require having a session without inserting credentials or be redirected to the login page.

Run the application using either the `Launch` VSCode command or via terminal.

### Other Useful Commands

Compile both client + server
```
npm run build-all
```

To run the e2e tests
``` 
 - Terminal 1
	> npm run test
 - Terminal 2
	> npm run e2e-tests
```

## Development

A. If you need to create a **database migration script**, you can follow this [README](api/core/bootstrap/db-patches/mongo/patch-applier/patches/README.md)

## Deployment

### SSL Setup

For certificates letsencrypt.org was used as CA.

Certificate generation for Nginx:

 1. On the application server install letsencrypt:
```
sudo apt-get install letsencrypt
```
    
 2. While having only the default site configuration enabled on Nginx, run the 
following coomand in order to generate the certificates:
```
sudo letsencrypt certonly --webroot -w /var/www/html -d app.unitpal.com -d www.app.unitpal.com
```
 3. The certificates will be generated in:
    
    `/etc/letsencrypt/live/app.unitpal.com`

    `fullchain.pem` will be used as certificate chain
    `privkey.pem` will be used as private key
    
 4. For cert renewal read:
    
    https://certbot.eff.org/#ubuntuxenial-nginx

### Ansible
ansible 2.1.3.0

1. In order to perform an application update (app code + dependencies) on all production application server nodes you can run the following command from your machine:
```    
ansible-playbook -i production --private-key=~/.ssh/unitpal_rsa -u unitpal unitpal_update.yml
```

2. In order to perform a full application deployment (including server configurations: node, pm2, nginx) on all production application server nodes you can run the following command from your machine:
```
ansible-playbook -i production --private-key=~/.ssh/unitpal_rsa -u unitpal unitpal_full_deployment.yml
```