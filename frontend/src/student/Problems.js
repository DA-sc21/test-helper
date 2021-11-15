import React from 'react'
import { ListGroup , Col, Tab ,Row } from 'react-bootstrap'

export function Problems(props){
	return(
			<Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
				<Row>
					<Col sm={3}>
						<ListGroup>
							<ListGroup.Item action href="#link1">
									문제 1
							</ListGroup.Item>
							<ListGroup.Item action href="#link2">
									문제 2
							</ListGroup.Item>
						</ListGroup>
					</Col>
					<Col sm={9}>
						<Tab.Content>
							<Tab.Pane eventKey="#link1">
									1번 문제입니다.
							</Tab.Pane>
							<Tab.Pane eventKey="#link2">
									2번 문제입니다.
							</Tab.Pane>
						</Tab.Content>
					</Col>
				</Row>
			</Tab.Container>)
    }