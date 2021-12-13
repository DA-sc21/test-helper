import React from 'react';
import { Carousel } from 'react-bootstrap';
function Main(){
  return(
    <>
    <div style={{height:"93vh", backgroundColor:"#090d1d"}}>
      {/* <img src="./img/main.png" style={{marginLeft:"2%", width:"87%", height:"100%"}}/> */}
      <Carousel style={{backgroundColor:"#090d1d", height:"100%",}}>
        <Carousel.Item interval={1500}>
          <img
            className="d-block"
            src="./img/main.png"
            alt="First slide"
            style={{height:"86vh", width:"90%", marginLeft:"7%"}}
          />
        </Carousel.Item>
        <Carousel.Item interval={2500}>
          <img
            className="d-block w-100"
            src="./img/main1.png"
            alt="Second slide"
            style={{height:"86vh", marginLeft:"1%"}}
          />
        <Carousel.Caption>
          <h3>AI 본인인증 자동화</h3>
          <p>AI를 통해 학생증의 학번 일치 여부와 학생증과 시험 응시자 얼굴 일치 여부를 확인하여 대학생 본인인증 절차를 자동화합니다</p>
        </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={2500}>
          <img
            className="d-block w-100"
            src="./img/main2.png"
            alt="Third slide"
            style={{height:"86vh", marginLeft:"1%"}}
          />
        <Carousel.Caption>
          <h3>AI 시험 감독 보조</h3>
          <p>AI를 통해 대학생의 두 손을 인식하고 화면에서 벗어난 순간을 부정행위로 판단한 후 알림을 전송합니다</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={2500}>
          <img
            className="d-block w-100"
            src="./img/main3.png"
            alt="Third slide"
            style={{height:"86vh", marginLeft:"1%"}}
          />
        <Carousel.Caption>
          <h3>답안지 관리 툴</h3>
          <p>본 서비스를 통해 제출 및 캡쳐 답안지 확인이 가능합니다</p>
        </Carousel.Caption>
      </Carousel.Item>
     </Carousel>  
    </div>
    {/* <div style={{height:"5vh", backgroundColor:"#21242b"}}>
      <span style={{color:"white", fontSize:"18px", float:"right", marginTop:"5px", marginRight:"2%"}}>문의: testhelper@naver.com</span>
    </div> */}
    </>
  )
}
export default Main;