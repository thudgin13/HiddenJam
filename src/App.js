import './App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Dashboard from './Dashboard';
import Login from './Spotify/login';
import token from './Spotify/spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
    };
  }

  componentDidMount() {
    this.setState({ token: token });
  }

  render() {
    return (
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: '100vh', maxWidth: '900px' }}
      >
        <Router>
          <Switch>
            {this.state.token ? (
              <Route exact path="/" component={Dashboard} />
            ) : (
              <Route path="/" component={Login} />
            )}

            <Route path="/login" component={Login} />
          </Switch>
        </Router>
      </Container>
    );
  }
}

export default App;
