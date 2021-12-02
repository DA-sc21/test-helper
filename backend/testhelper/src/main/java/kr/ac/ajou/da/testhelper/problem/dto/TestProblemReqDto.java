package kr.ac.ajou.da.testhelper.problem.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter(value = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
public class TestProblemReqDto {
	
	private Long problemNum;
	private String question;
	private Long point;
	private String attachedFile;

}
