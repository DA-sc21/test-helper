import React, { useState } from 'react'
import {Card,Button} from 'react-bootstrap'
import {baseUrl} from "../component/baseUrl"
import axios from 'axios';
import { useParams } from 'react-router-dom';

function TestStudentAgreement(props){
  let {testId, studentId} =useParams();
  let [agree,setagree]=useState(false)
  let [consented,setConsented]=useState(props.consented)
  console.log(props.consented)

  async function studentConsented(consentedChange){
    
    const data = {
      "consented": consentedChange
    };

    let response = await fetch(baseUrl+`/tests/`+testId+'/students/'+studentId+'/submissions/consented',{
      method: 'PUT',
      credentials : 'include',
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    })
    .then( res => {
      console.log("response:", res);
      setConsented(!consented)
      if(res.status === 200){
        alert("사전 동의가 완료되었습니다.");
        let temp=[...props.tabCompleted]
        temp[0]=consented
        props.setTabCompleted(temp)
      }
      else{
        alert("사전 동의에 실패했습니다. 잠시 후 다시 시도해주세요");
      }
      }
    )
    .catch(error => {console.error('Error:', error)});

  }

  return(
    <div className="p-5"> 
      <Card className="mt-0 m-5">
        {/* <Card.Header as="h5">안내사항</Card.Header> */}
        <Card.Body>
          <h5>안내사항</h5>
          <hr></hr>
          <Card.Text style={{textAlign:"left", marginLeft:"5%"}}>
            <p>- 시험 중 응시자 간 의사소통을 금지합니다.</p>

            <p>- 시험 중 촬영 화면(카메라 밖)의 이탈을 금지합니다.</p>

            <p>- 공공 장소가 아닌 혼자 있는 개인 장소에서 응시하며, 모자, 이어폰 등의 착용을 금지합니다.</p>

            <p>- 시험 응시 환경에 불필요한 물건을 비치하지 않으며, 시험과 무관한 프로그램은 모두 종료합니다.</p>

          </Card.Text>
        </Card.Body>
      </Card>
      <Card className="m-5">
        {/* <Card.Header as="h5">사전동의</Card.Header> */}
        <Card.Body>
          <h5>사전동의</h5>
          <hr></hr>
          {/* <Card.Title>Special title treatment</Card.Title> */}
          <Card.Text>
            PC화면 공유 및 녹화, 모바일 화면공유 및 녹화, 모바일 마이크 공유 및 녹화에 동의합니다.
          </Card.Text>

          {!consented?
          <Button variant="dark" type="submit" onClick={()=>{
            studentConsented(true)
          }}>
            동의합니다
          </Button>
          :
          <Button variant="secondary" type="submit" disabled onClick={()=>{
            studentConsented(false)
          }}>
            동의완료
          </Button>
        }

        </Card.Body>
      </Card>
    </div>
  )
}
export default TestStudentAgreement