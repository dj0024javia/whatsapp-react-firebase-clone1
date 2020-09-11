import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { StateProvider } from './StateProvider';
import reducer, { initialState } from './reducer';

ReactDOM.render(
  // Firstly Create StateProvider Function. This function allows us to wrap entire app in data container and we can put and fetch any variable from there.
  // InitialState takes initial state of the data layer and reducer takes current state of the data layer and passes on the next state to data layer
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>
      <App />
    </StateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
