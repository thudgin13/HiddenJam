import React, { useRef, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import token from './Spotify/spotify';
import axios from 'axios';
import Playlist from './Playlist';

export default function PreferencesForm(props) {
  const [hiddenJams, setHiddenJams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const danceRef = useRef();
  const instrumentalRef = useRef();
  let artistRef = useRef();
  let trackRef = useRef();
  let genreRef = useRef();
  let arrToFilter = [];
  let genreSet;
  let tracks;
  function handleChange(event) {
    if (event.target.name === 'artist') {
      artistRef = event.target.value;
    }
    if (event.target.name === 'track') {
      trackRef = event.target.value;
    }
    if (event.target.name === 'genre') {
      genreRef = event.target.value;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    const market = props.user.country;
    if (genreRef.includes(' ')) {
      genreRef = genreRef.split(' ').join('%20');
    }

    tracks = await axios
      .get(
        `https://api.spotify.com/v1/recommendations?limit=20&market=${market}&seed_artists=${artistRef}&seed_genres=${genreRef}&seed_tracks=${trackRef}&max_danceability=${danceRef.current.value}&target_instrumentalness=${instrumentalRef.current.value}&max_popularity=58`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then(trackResponse => {
        console.log('track response', trackResponse.data.tracks);
        setLoading(false);
        return trackResponse.data.tracks;
      });
    console.log('tracks --->', tracks);
    setLoading(false);
    setClicked(true);
    return setHiddenJams(tracks);
  }
  if (!loading && clicked) {
    return (
      <Playlist
        className="w-100"
        playlist={hiddenJams}
        loading={loading}
        user={props.user}
      />
    );
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group id="artists">
          <Form.Label> Artist Influence:</Form.Label>
          <Form.Control
            as="select"
            ref={artistRef}
            name="artist"
            onChange={handleChange}
            placeholder="Select Artist"
          >
            <option>Select Artist</option>
            {props.artists.sort().map(artist => {
              return (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              );
            })}
          </Form.Control>
        </Form.Group>
        <Form.Group id="tracks">
          <Form.Label>Track Influence:</Form.Label>
          <Form.Control
            as="select"
            ref={trackRef}
            name="track"
            onChange={handleChange}
          >
            <option>Select a Track</option>
            {props.tracks.sort().map(track => {
              return (
                <option
                  key={track.track.id}
                  value={track.track.id}
                  ref={trackRef}
                >
                  {track.track.name}
                </option>
              );
            })}
          </Form.Control>
        </Form.Group>
        <Form.Group id="genres">
          <Form.Label>Genre Influence:</Form.Label>
          <Form.Control
            as="select"
            ref={genreRef}
            name="genre"
            onChange={handleChange}
          >
            <option>Select Genre</option>
            {props.artists.map((artist, index) => {
              artist.genres.map((genre, index) => {
                return arrToFilter.push(genre);
              });
              arrToFilter.sort();
              genreSet = [...new Set(arrToFilter)];
              return genreSet;
            })}
            {genreSet.map((genre, index) => {
              return (
                <option key={index} value={genre} ref={genreRef}>
                  {genre}
                </option>
              );
            })}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label min="0" max="100">
            Danceability
          </Form.Label>
          <Form.Control
            type="range"
            label="danceability"
            min="0"
            max="100"
            ref={danceRef}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Instrumentalness</Form.Label>
          <Form.Control
            type="range"
            label="danceability"
            min="0"
            max="100"
            ref={instrumentalRef}
          />
        </Form.Group>
        <div className="text-left mt-4">
          <Button
            type="submit"
            className="btn btn-primary btn-small w-100 mt-3"
            disabled={loading}
          >
            <strong>Find Your Hidden Jams</strong>
          </Button>
        </div>
      </Form>
    </div>
  );
}
