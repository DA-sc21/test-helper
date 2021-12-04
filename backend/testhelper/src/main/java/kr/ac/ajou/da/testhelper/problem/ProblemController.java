package kr.ac.ajou.da.testhelper.problem;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessTestByProctor;
import kr.ac.ajou.da.testhelper.common.security.authority.IsProfessor;
import kr.ac.ajou.da.testhelper.problem.dto.TestProblemReqDto;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ProblemController {
	
	private final ProblemService problemService;
	
	@GetMapping("/tests/{testId}/problems")
    public ResponseEntity<List<Problem>> getTestProblem(@PathVariable Long testId) {

        return ResponseEntity.ok().body(problemService.getByTestId(testId));

    }
	
	@PostMapping("/tests/{testId}/problems")
	@AccessTestByProctor
	public ResponseEntity<BooleanResponse> postTestProblem(@PathVariable Long testId, @RequestBody TestProblemReqDto reqDto) {
		return ResponseEntity.ok().body(BooleanResponse.of(problemService.postTestProblem(testId, reqDto)));
	}
	
	@PutMapping("/tests/{testId}/problems")
	@AccessTestByProctor
	public ResponseEntity<BooleanResponse> putTestProblem(@PathVariable Long testId, @RequestBody TestProblemReqDto reqDto) {
		return ResponseEntity.ok().body(BooleanResponse.of(problemService.putTestProblem(testId, reqDto)));
	}

}
