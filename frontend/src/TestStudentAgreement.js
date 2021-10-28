import React from 'react'
import {Card,Button} from 'react-bootstrap'

function TestStudentAgreement(props){
  return(
    <div className="p-5"> 
      <Card className="mt-0 m-5">
        <Card.Header as="h5">안내사항</Card.Header>
        <Card.Body>
          <Card.Title>수능 유의사항을 임시로 넣어봤습니다... </Card.Title>
          <Card.Text>
            예비소집 : 시·도교육감이 시험 전일에 실시(일시 및 장소는 원서접수증에 표시됨)

            수험표를 교부

            주의사항 등을 전달

            응시할 시험장과 시험실 확인

            방역상황 유지를 위해 시험실 건물 안으로의 입장이 금지되므로 학교의 안내를 받을 것

            2시험당일 수험표와 주민등록증 또는 본인임을 입증할 수 있는 신분증을 반드시 지참

            수험표 분실시에는 입실시간 전까지 수험표를 재교부 받아 시험에 지장을 초래하지 않도록 유의

            3모든 수험생은 시험 당일 시험장 내에서 마스크 착용 등 시험장 방역 지침을 반드시 준수

            4모든 수험생은 모든 물품에 대한 관리 절차 및 감독관의 지시에 따라야 함.

            시험장 반입 금지 물품

            휴대전화, 스마트기기(스마트워치 등), 디지털 카메라, 전자사전, MP3 플레이어, 카메라펜, 전자계산기, 라디오, 휴대용 미디어 플레이어, 통신‧결제기능(블루투스 등) 또는 전자식 화면표시기(LED 등)가 있는 시계, 전자담배, 통신(블루투스) 기능이 있는 이어폰 등 모든 전자기기

            시험장 반입 금지 물품을 불가피하게 시험장에 반입한 경우
            1교시 시작 전에 감독관의 지시에 따라 제출해야 하며(미제출시 부정행위 간주) 응시하는 모든 영역/과목의 시험 종료 후 되돌려 받음.

          </Card.Text>
        </Card.Body>
      </Card>
      <Card className="m-5">
        <Card.Header as="h5">사전동의</Card.Header>
        <Card.Body>
          <Card.Title>Special title treatment</Card.Title>
          <Card.Text>
            PC화면 공유 및 녹화, 모바일 화면공유 및 녹화, 모바일 마이크 공유 및 녹화에 동의합니다.
          </Card.Text>
          <Button variant="primary" type="submit" onClick={()=>{
            console.log(props.tabCompleted)
            let temp=[...props.tabCompleted]
            temp[0]=true
            props.setTabCompleted(temp)
          }}>
            동의합니다
          </Button>
        </Card.Body>
      </Card>
    </div>
  )
}
export default TestStudentAgreement