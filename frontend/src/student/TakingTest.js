import React, { useState } from 'react'
import { Button , Modal } from 'react-bootstrap'
import { Problems } from './Problems';
import SubmitAnswer from './SubmitAnswer';

function TakingTest(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    console.log(props.data)
    
    // let id = props.data.room.device + props.data.student.id;

    return (
      <>
        <Button variant= "success" size="lg" disabled= {!props.started} onClick={handleShow}>
          시험장입장
        </Button>

        <Modal show={show} fullscreen={true} onHide={handleClose}>
          <Modal.Header >
            <Modal.Title>시험장</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {props.ended?
            <SubmitAnswer handleClose={handleClose}></SubmitAnswer>
            :<Problems></Problems>
            }
          </Modal.Body>
          <Modal.Footer>
            <div style={{backgroundColor:"#2a2f38",color:"white", textAlign:"center", padding:"4px",margin:"10px", borderRadius:"5px", fontWeight:"bold"}}>
              {
                props.ended 
                ?  "시험 종료 "+(-props.remainEndTime.days)+"일 "+(-props.remainEndTime.hours)+"시간 "+(-props.remainEndTime.minutes)+"분 "+(-props.remainEndTime.seconds)+"초 지났습니다."
                :  "시험 종료까지 "+ props.remainEndTime.days+"일 "+props.remainEndTime.hours+"시간 "+props.remainEndTime.minutes+"분 "+props.remainEndTime.seconds+"초 남았습니다." 
              }
            </div>
            <Button variant="secondary" onClick={handleClose}>
              시험종료
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }


export default TakingTest 