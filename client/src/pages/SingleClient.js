import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function SingleClient() {
  const [client, handleClient] = useState(null);
  const [jobs, handleJobs] = useState([]);

  const { code } = useParams();

  useEffect(() => {
    fetchClientByCode();
    // fetchJobsByClientId();
  }, []);

  async function fetchClientByCode() {
    let requestBody = {
      query: `
      query {
        clientByCode(code: "${code}") {
          _id
          name
        }
      }
      `
    };

    const res = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res
      .json()
      .then((resData) => {
        handleClient(resData.data.clientByCode);
        fetchJobsByClientId(resData.data.clientByCode._id);
      })
      .catch((err) => console.error(err));
  }

  async function fetchJobsByClientId(clientId) {
    let requestBody = {
      query: `
      query {
        jobsByClientId(clientId: "${clientId}") {
          _id
          code
          title
          description
          tags
          files
        }
      }`
    };

    const res = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res
      .json()
      .then((resData) => handleJobs(resData.data.jobsByClientId))
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <h1>single client page</h1>
      <h4>this client: {code}</h4>
      <h5>this clients jobs:</h5>
      <ul>
        {jobs.map((job) => (
          <li key={job._id}>
            {job.title} - {job.code}
          </li>
        ))}
      </ul>
    </div>
  );
}
