<h1>Sports Stats App</h1>
<p><b>Summary: </b>I created a Full-Stack MERN app to collect and display the stats of different players and teams across many sports (currently only NBA 2024-2025 supported). 
  There are 3 main components of the project: a react front-end, an express api, and a mongo database. The react app is hosted using GitHub Pages. The express api is hosted using render.com. 
  And, the mongo db is hosted using Atlas. </p>
<p><b>Dependencies: </b>Node.js, axios, cors, express, mongoose, socket.io, react, react-router-dom, socket.io-client, gh-pages</p>
<h2>Release Notes </h2>
<ul>
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
    <p><strong>Description: </strong>App runs the api. It has the socket to connect to the front-end as well as being a front for the routers. </p>
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
