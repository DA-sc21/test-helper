package kr.ac.ajou.da.testhelper.answer;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import kr.ac.ajou.da.testhelper.answer.dto.PostAnswerReqDto;
import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessTestByProctor;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AnswerController {
	private final AnswerService answerService;

	@PostMapping("/tests/{testId}/answers")
	@AccessTestByProctor
    public ResponseEntity<BooleanResponse> postAnswer(@PathVariable Long testId, @RequestBody PostAnswerReqDto reqDto) {
		return ResponseEntity.ok().body(BooleanResponse.of(answerService.postAnswer(reqDto)));
    }
}
