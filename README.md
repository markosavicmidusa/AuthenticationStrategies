# AuthenticationStrategies  NODE.JS EXPRESS.JS PASSPORT.JS
Description: The application represents an attempt to integrate all important authentication protocols with
using Passport.js middleware. Important authentication strategies are implemented
protocol:
1. Local strategy, which uses the Session id stored in the database (also in the cookie
client browser) and represents server authentication because the data that
they compare the results stored in the database during each user request.
2. JWT-strategy, a strategy based on the use of tokens
user registrations are issued and signed by the private key used by the application,
of course, encryption algorithms are used in the process itself. Tokens are stored on
to the client and uses them during each subsequent request, includes them in its head-
er. The application checks the correctness and integrity of the token, by applying public
key.
3. OAuth, the use of this type of strategy is most often used in the so-called "Third-
party-applications", is an authentication and authorization protocol, which
they use the credentials of another application, for example a Google account, for issuing
access and refresh token that will enable the use of the main application with access
data of another application from which we received tokens, in this case a Google account

## Installation
1) You need to install the MongoDB Community Server on: https://www.mongodb.com/try/download/community
2) Clone the project running the next command in terminal:
```bash 
git clone https://github.com/markosavicmidusa/AuthenticationStrategies.git
```
3) In terminal run command:
```bash
npm install
```
4) Install nodemon globaly
```bash
npm install nodemon -g
```
5) Create new file in root of directory 
```bash
touch .env
```
## Seting up a project
1) You need to register API in Google Developer Centar, and you need to copy your GOOGLE_SECRET and GOOGLE_ID
2) Open the .env file and paste the next lines of code
```javascript
DB_STRING=mongodb://localhost:27017/ispit
SECRET=fahsv4315dhwq53
GOOGLE_CLIENT_SECRET=paste_your_secret_here
GOOGLE_CLIENT_ID=paste_your_client_id_here
```
## Starting the app
In the terminal paste the command:
```bash
npm start app.js
```
