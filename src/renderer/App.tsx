import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';

import Board from 'components/Board';
import './App.global.css';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Board} />
      </Switch>
    </Router>
  );
}
