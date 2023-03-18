import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'normalize.css';
import firebase, { FirebaseOptions, initializeApp } from 'firebase/app';
import 'firebase/database';


const firebaseConfig  = {
  apiKey: "AIzaSyDO56QYazvgaipr8pfuD6XCvpblBa2wAXg",
  authDomain: "flappy-bat-7a96b.firebaseapp.com",
  projectId: "flappy-bat-7a96b",
  storageBucket: "flappy-bat-7a96b.appspot.com",
  messagingSenderId: "65907282592",
  appId: "1:65907282592:web:7720611dc062c9d24d6fc5",
  measurementId: "G-5R95Q8WXVF"
};


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
