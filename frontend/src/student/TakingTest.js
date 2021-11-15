import React, { useState } from 'react'
import { Button , Modal } from 'react-bootstrap'
import { Problems } from './Problems';

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
            <Button>채팅하기</Button>
          </Modal.Header>
          <Modal.Body>
            {props.ended?
							<div>시험이 종료되었습니다. 답안 제출을 진행해주세요</div>
            :<Problems></Problems>
            }
          </Modal.Body>
          <Modal.Footer>
            시험 종료 시간인 {props.endTime} 까지 {props.remainEndTime.hours}시간 {props.remainEndTime.minutes}분 {props.remainEndTime.seconds}초 남았습니다.{props.ended}
            <Button variant="secondary" onClick={handleClose}>
              시험종료
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }


export default TakingTest 