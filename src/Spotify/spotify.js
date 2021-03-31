import queryString from 'query-string';
import axios from 'axios';

const parsed = queryString.parse(window.location.search);

const expire_time = 3600 * 1000; // spotify token expires in 1 hour according to doc
const expireAt = () =>
  window.localStorage.setItem(
    'expires_at',
    JSON.stringify(1000 + new Date().getTime())
  );

// This Parses the access_token && refresh_token in in the url.

// console.log('am i getting the info from url?', parsed);

const refreshToken = token =>
  window.localStorage.setItem('refresh_token', token);

const refreshAccessToken = async () => {
  try {
    const { data } = await axios.get(`&refresh_token==${refreshToken()}`);
    const { access_token } = data;
    accessToken(access_token);
    window.location.reload();
    return;
  } catch (error) {
    console.log(error);
  }
};

const accessToken = token => {
  expireAt();
  window.localStorage.setItem('access_token', token);
};

const getToken = () => window.localStorage.getItem('access_token');
export const getStorageToken = () => {
  const { access_token, refresh_token, err } = parsed;

  if (err) {
    console.log(err);
    refreshAccessToken();
  }

  // If token is expired
  if (Date.now() - expireAt() > expire_time) {
    console.warn('Access token has expired, refreshing..');
    refreshAccessToken();
  }

  const storageToken = getToken();
  const storageRefreshToken = refreshToken();

  if (!storageToken || storageToken === 'undefined') {
    accessToken(access_token);
    return access_token;
  }

  if (!storageRefreshToken || storageRefreshToken === 'undefined') {
    refreshToken(refresh_token);
  }

  // if (
  //   !storageToken ||
  //   storageToken ||
  //   !storageRefreshToken ||
  //   storageRefreshToken === undefined
  // ) {
  //   window.localStorage.clear();
  // }
  return storageToken;
};

export const token = getStorageToken();
export default token;

// console.log("am i getting a token??", token);

export const logout = () => {
  window.localStorage.removeItem('expires_at');
  window.localStorage.removeItem('access_token');
  window.localStorage.removeItem('refresh_token');
  window.history.pushState(null, null, '/');
  window.location.reload();
};

const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
};

/*
 * Get Current User's Profile
 * GET https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/
 */

export const getUser = () =>
  axios.get('https://api.spotify.com/v1/me', { headers });

/**
 * Get Current User's Recently Played Tracks
 * GET https://developer.spotify.com/documentation/web-api/reference/player/get-recently-played/
 */

export const getRecentlyPlayed = () =>
  axios.get('https://api.spotify.com/v1/me/player/recently-played', {
    headers,
  });

/**
 * Get User's Top Artists and Tracks
 * https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
 */

export const getTopArtists = () =>
  axios.get(
    'https://api.spotify.com/v1/me/top/artists?time_range=medium_term',
    {
      headers,
    }
  );

export const getTopTracks = () =>
  axios.get('https://api.spotify.com/v1/me/top/tracks?limit=20', {
    headers,
  });

export const getHiddenJams = (
  danceRef,
  instrumentalRef,
  artistId,
  trackId,
  genre,
  market
) => {
  axios
    .get(
      `https://api.spotify.com/v1/recommendations?limit=20&market=${market}&seed_artists=${artistId}&seed_genres=${genre}&seed_tracks=${trackId}&max_danceability=${danceRef}&target_instrumentalness=${instrumentalRef}&max_popularity=54`,
      { headers }
    )
    .then(trackResponse => {
      console.log('TRACK RESPONSE RECEIVED', trackResponse.data.tracks);
      return { hiddenJams: trackResponse.data.tracks };
    });
};

export const getUserInfo = () => {
  return axios
    .all([getUser(), getRecentlyPlayed(), getTopArtists(), getTopTracks()])
    .then(
      axios.spread((user, recentPlayed, getTopArtists, getTopTracks) => {
        console.log('recently played request', recentPlayed.data.items);
        return {
          user: user.data,
          recentPlayed: recentPlayed.data.items,
          getTopArtists: getTopArtists.data.items,
          getTopTracks: getTopTracks.data.items,
        };
      })
    );
};
