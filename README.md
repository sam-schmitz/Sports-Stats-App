<h1>Sports Stats App</h1>
<p><b>Summary: </b>I created a Full-Stack MERN app to collect and display the stats of different players and teams across many sports (currently only NBA 2019-20 to 2024-2025 seasons supported). 
  There are 3 main components of the project: a react front-end, an express api, and a mongo database. The react app is hosted using GitHub Pages. The express api is hosted using render.com. 
  And, the mongo db is hosted using Atlas. The app contains data about every NBA game, player and team since the start of the 2019-2020 season. This includes season and career stats for players, rosters and team stats for teams, and player and team performances for each game. </p>
<p><b>Dependencies: </b>Node.js, axios, cors, express, mongoose, socket.io, react, react-router-dom, socket.io-client, gh-pages</p>
<p><b>Site Link: </b> <a href="https://sam-schmitz.github.io/Sports-Stats-App">[Sports Stats App](https://sam-schmitz.github.io/Sports-Stats-App)</a> 
  <b>Note: </b>Since the API is hosted for free the first request in a while may take up to 50 seconds to process. </p>
<h2>Release Notes </h2>
<ul>
  <li>
    <h4>Version 1.0</h4>
    <p><strong>Description: </strong>This update adds support for post vs regular season stats as well as release ready looks for componenets. Games can now be categorized as post or regular season. This allows the backend to calculate post, regular and overall season stats. Player page was updated to allow the user to view these new stats. Images were added to the home page and game pages. The search bar for the game list was updated to support search by date. These changes help to add more visual features to the web app and more specific stats to the players. </p>
  </li>
  <li>
    <h4>Version 0.3</h4>
    <p><strong>Description: </strong>This update brings major changes to the amount of data collected and the UI. Games now collect info about each player's performance within that game. That data is used to calculate a player's stats over a season. The database was also updated with games stretching back to the 2019-20 season. On the client side, player, game, and team pages now include a tab system to organize the data being displayed. Player pages display their stats and the games they played in. Team pages display the team's stats and the games on their schedule. Game pages display both team and player stats. Search bars were also added to game, player, and team pages to help the user better find what they were looking for. </p>
  </li>
  <li>
    <h4>Version 0.2</h4>
    <p><strong>Description: </strong>This update changes the source of the data. My data now comes from an unoficial ESPN api instead of the free sports api. This allows the app to have information about each player as well as more info about each game. Some formatting was improved too. </p>
  </li>
  <li>
    <h4>Version 0.1</h4>
    <p><strong>Description: </strong>First release of the app. The react app, api, and database were created. 
    The app is set up to store and display information about each player, team, and game. My data source needs to be replaced though. </p>
  </li>
</ul>
<h2>Project Elements</h2>
<h3>Backend: </h3>
<ul>
  <li>
    <h4>App</h4>
    <p><strong>Description: </strong>App runs the api. It has a socket to connect to the front-end as well as being a front for the routers. </p>
    <p><strong>Location: </strong>backend/app.js</p>
  </li>
  <li>
    <h4>Models</h4>
    <p><strong>Description: </strong>Contains the mongo models for games, players, and teams. Each model tells the database what information is to be stored for that item. </p>
    <p><strong>Location: </strong>backend/models/</p>
  </li>
  <li>
    <h4>Seeding Scripts</h4>
    <p><strong>Description: </strong>The seeding scripts (ex. seedGames.js) pull information from the free sports api and place it into the db. </p>
    <p><strong>Location: </strong>backend/scripts/</p>
  </li>
  <li>
    <h4>Routers</h4>
    <p><strong>Description: </strong>Each router takes an api call, then pulls the cooresponding data from the database. </p>
    <p><strong>Location: </strong>backend/routes/</p>
  </li>
</ul>
<h3>Client: </h3>
<ul>
  <li>
    <h4>App</h4>
    <p><strong>Description: </strong>Houses the router for the react app. Points each endpoint to the correct page. </p>
    <p><strong>Location: </strong>client/src/App.js</p>
  </li>
  <li>
    <h4>Lists</h4>
    <p><strong>Description: </strong>Each type of list displays all of the same type of elements stored in the database. For example Games list has links to each of the games stored in the database. </p>
    <p><strong>Location: </strong>client/src/components/</p>
  </li>
  <li>
    <h4>Element Pages</h4>
    <p><strong>Description: </strong>These pages present all of the information about a specific element in the database. For example, player page displays a player's team, jersey number, age, etc. </p>
    <p><strong>Location: </strong>client/src/components/</p>
  </li>
  <li>
    <h4>Home Page</h4>
    <p><strong>Description: </strong>The home page is a landing page for the website. </p>
    <p><strong>Location: </strong>client/src/components/Home.js</p>
  </li>
</ul>
