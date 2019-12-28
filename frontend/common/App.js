import React from 'react';
import Koji from '@withkoji/vcc';
import { Game } from '../components/Game';

class App extends React.Component {
  render() {
    return (
      <Game currentLevel={0} />
    );
  }
}

export default App;
