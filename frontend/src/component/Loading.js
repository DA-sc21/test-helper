import React from 'react'
import { Spinner } from 'react-bootstrap';

function Loading(){
  return(
    <div className="m-5 p-5 d-flex row justify-content-center">
      <h1 className="col-md-12">정보를 불러오고 있습니다.</h1>
      <Spinner className="m-5 p-5 "animation="border" role="status" />
    </div>
  )
}
export default Loading