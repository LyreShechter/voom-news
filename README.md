# voom-news

Welcome to my implementation of the Voom News Website!

My project is composed of three parts:

### news-collector

The news collector is a `node.js` script that runs every 10 minutes.  
It fetches news about drones from the NewsAPI and saves it to a `MongoDB` instance.

> It's important to say that the connection to the DB will not work for you as your IP is not whitelisted.  
> Contact me to in order to whitelist your IP so you can access the data!

In order to run news-collector: `cd news-collector && npm install && npm run start`.

### server

The server is also built with `node.js` using `express`.

It has a single API endpoint: `/api/news`.  
The endpoint fetches data from the DB.  
It is also able to recieve a URL parameter `keywords`, which will filter the results from the DB.

In order to run server: `cd server && npm install && npm run start`.

### client

The client is built with `React` using `create-react-app` as the base template.  
It fetches news data from the server side and displays the relevant headlines.  
It also has a search component which allows to search the headlines' title or author.

In order to run client: `cd server && npm install && npm run start`.
