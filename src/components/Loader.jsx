import React from 'react'
import Spinner from 'react-bootstrap/Spinner';

const Loader = ({content}) => {
  return (
    <div className='loader-container'>
        <div className='loader'>
        <Spinner 
        as="span"
        animation="border"
        variant="light"
        role="status"
        aria-hidden="true">
          
        </Spinner>
        <span className='loader-text'>Fetching latest answer. Please wait for a moment...</span>
        </div>
    </div>
  )
}

export default Loader