package kr.ac.ajou.da.testhelper.answer.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter(value = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
public class GetAnswerResDto {
	private Long id;
	private Long testId;
	private String file;
}
