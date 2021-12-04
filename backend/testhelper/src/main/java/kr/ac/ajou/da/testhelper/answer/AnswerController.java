package kr.ac.ajou.da.testhelper.answer;

import java.sql.SQLException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import kr.ac.ajou.da.testhelper.answer.dto.PostAnswerReqDto;
import kr.ac.ajou.da.testhelper.answer.dto.GetAnswerResDto;
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
		return ResponseEntity.ok().body(BooleanResponse.of(answerService.postAnswer(testId, reqDto)));
    }
	
	@GetMapping("/tests/{testId}/answers")
	public ResponseEntity<List<GetAnswerResDto>> getAnswer(@PathVariable Long testId) {
		return ResponseEntity.ok().body(answerService.getAnswerByTestId(testId));
	}
	
	@DeleteMapping("/tests/{testId}/answers/{answerId}")
	@AccessTestByProctor
	public ResponseEntity<BooleanResponse> deleteAnswer(@PathVariable Long testId, @PathVariable Long answerId) {
		return ResponseEntity.ok().body(BooleanResponse.of(answerService.deleteAnswer(answerId)));
	}
}
