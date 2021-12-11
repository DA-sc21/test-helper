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
public class GetProblemResDto {
	private Long id;
	private Long problemNum;
	private Long testId;
	private String question;
	private Long point;
	private String attachedFile;
}
