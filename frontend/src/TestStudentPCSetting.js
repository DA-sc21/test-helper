import React from 'react'
import PCScreenShare from './kinesisVideo/PCScreenshare'

function TestStudentPCSetting(){
  return(
    <div className="m-4 p-4">
      <h5>아래 <span style={{ color: 'rgb(43, 73, 207)', fontWeight: 'bold'}}>화면 공유하기</span> 버튼을 클릭하고, <span style={{ fontWeight: 'bold' }}>전체 화면</span>을 선택하여 공유해주세요.</h5>
      <PCScreenShare region=""  accessKey="" secretAccessKey="" sessionToken="" channelName="" clientId=""></PCScreenShare>
    </div>
  )
}

export default TestStudentPCSetting