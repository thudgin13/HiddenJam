import React from 'react';
import { Card } from 'react-bootstrap';

export default function login() {
  return (
    <div className="w-80">
      <Card>
        <Card.Body>
          <h2> Ready to find your hidden jam?</h2>
          <a
            href="http://localhost:8888/login"
            className="btn btn-success text-center w-100"
          >
            Login With Spotify To Start
          </a>
        </Card.Body>
      </Card>
    </div>
  );
}
