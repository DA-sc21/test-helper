
import "./Chat.css"
import React from "react"

export default function ChatList(props){
    return(
			<div className="row clearfix">
				<div className="col-lg-12">
					<div className="card chat-app">
						<div className="chat">
							<div className="chat-history">
								<ul className="m-b-0">
									{
									props.chat.split("\n").map((chat,index)=>{
										if (chat==="")return
										let temp=chat.split("!@#");
										let time=temp[0]
										let person=temp[1]
										let dialog=temp[2]
										return(
										<li className="clearfix" key={index}>
											<div className={person===props.role?"message-data text-right":"message-data text-left"}>
													<span className="message-data-time">{time}, {person}</span>
											</div>
											<div className={person===props.role?" col-md-12 message other-message float-right":" col-md-12 message my-message"} > {dialog} </div>
										</li>)
									})
									}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>)
}