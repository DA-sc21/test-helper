package kr.ac.ajou.da.testhelper.submission.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter(value = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
public class GetSubmissionStatusResDto {
	private String verified;
	private Boolean consented;
}
