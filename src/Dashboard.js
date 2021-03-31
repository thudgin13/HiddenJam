import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';
import { getUserInfo, logout } from './Spotify/spotify';
import PreferencesForm from './PreferencesForm';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      topArtists: [],
      topTracks: [],
      user: {},
    };
  }

  async getData() {
    const {
      user,
      getTopArtists,
      getTopTracks,
      recentPlayed,
    } = await getUserInfo();
    console.log('GET TOP TRACKS', getTopTracks);
    console.log('GET Recently played', recentPlayed);
    this.setState({
      loading: false,
      topArtists: getTopArtists,
      topTracks: recentPlayed,
      user: user,
    });
    console.log('USER', this.state.user);
  }

  componentDidMount() {
    this.getData();
    console.log(this.state);
  }

  render() {
    return (
      <>
        <div className="w-100">
          <Card>
            <Card.Body>
              {this.state.loading === true ? (
                <h2> loading... </h2>
              ) : (
                <h2 className="text-center mb-4">
                  Welcome, {this.state.user.display_name}!
                </h2>
              )}
              {this.state.loading === false ? (
                <PreferencesForm
                  artists={this.state.topArtists}
                  tracks={this.state.topTracks}
                  user={this.state.user}
                />
              ) : (
                <div></div>
              )}
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            <Button
              type="button"
              className="btn btn-small btn-light"
              onClick={logout}
            >
              Log Out
            </Button>
          </div>
        </div>
      </>
    );
  }
}
export default Dashboard;
