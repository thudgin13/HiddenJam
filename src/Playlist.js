import React, { useState } from 'react';
import { ListGroup, Image, Button } from 'react-bootstrap';
import { MusicNoteList } from 'react-bootstrap-icons';
import token from './Spotify/spotify';
import axios from 'axios';

export default function Playlist(props) {
  const [waiting, setWaiting] = useState(true);

  //set waiting to false once component has the tracks in state
  if (!props.loading && waiting) {
    setWaiting(false);
    console.log(token);
  }
  //loading screen...
  if (waiting) {
    return <h3>Finding you new music...</h3>;
  }

  async function handleClick(event) {
    let uri = event.target.value;
    console.log('uri -->', uri);
    console.log('imported token', token);
    let access_token = window.localStorage.getItem('access_token');
    // console.log('access -->', access_token);
    // uri = uri.split(':').join('%3');
    console.log('edited URI -->', uri);
    return axios.post(
      `https://api.spotify.com/v1/me/player/queue?uri=${uri}`,
      token,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
  }

  return (
    <div>
      {props.playlist.length < 20 && (
        <h5 className="mb-3">
          Hint: try broadening your search to get more matches!
        </h5>
      )}
      {!waiting && (
        <ListGroup>
          {props.playlist.map((track, index) => {
            return (
              <ListGroup.Item key={track.id} className="h-40">
                <Image
                  src={track.album.images[0].url}
                  thumbnail
                  className="mr-3"
                  style={{ width: '70px', height: '70px' }}
                />
                <strong>{track.name} </strong>by {track.artists[0].name}
                <Button
                  type="button"
                  value={track.uri}
                  onClick={handleClick}
                  className="m-1 btn btn-sm btn-info ml-3"
                >
                  <MusicNoteList className="mr-1" />
                  Add to queue
                </Button>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </div>
  );
}
