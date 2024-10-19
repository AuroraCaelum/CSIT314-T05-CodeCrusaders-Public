// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
const express = require('express');
const app = express();
const userAccountController = require('./controller/UserAccountController');

app.use(express.json());

// User authentication routes
app.post('/register', userAccountController.register);
app.post('/login', userAccountController.login);
app.post('/logout', userAccountController.logout);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
