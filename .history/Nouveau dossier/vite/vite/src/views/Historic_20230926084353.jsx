import React from 'react'
import { useParams } from 'react-router-dom';

export default function Historic() {
    let {num_container} = useParams();

  return (
    <div>Historic : {num_container}</div>

  )
}
