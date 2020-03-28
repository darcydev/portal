import React from 'react';
import { useParams } from 'react-router-dom';

export default function SingleJob() {
  const { code } = useParams();

  return (
    <div>
      <h1>single job page</h1>
      <h4>this job: {code}</h4>
    </div>
  );
}
