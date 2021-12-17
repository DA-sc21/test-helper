package kr.ac.ajou.da.testhelper.problem;

import kr.ac.ajou.da.testhelper.aws.s3.PreSignedURLService;
import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessTestByProctor;
import kr.ac.ajou.da.testhelper.common.security.authority.IsProfessor;
import kr.ac.ajou.da.testhelper.problem.dto.GetProblemResDto;
import kr.ac.ajou.da.testhelper.problem.dto.GetTestProblemResDto;
import kr.ac.ajou.da.testhelper.problem.dto.TestProblemReqDto;
import kr.ac.ajou.da.testhelper.test.Test;
import kr.ac.ajou.da.testhelper.test.TestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;
    private final TestService testService;
	private final PreSignedURLService preSignedURLService;

    @GetMapping("/tests/{testId}/problems")
    public ResponseEntity<List<GetTestProblemResDto>> getTestProblem(@PathVariable Long testId) {

        return ResponseEntity.ok().body(problemService.getByTestId(testId).stream().map(problem -> {
        	String preSignedURL = null;
			if(problem.getAttachedFile() != null && problem.getAttachedFile().length() != 0) {
				preSignedURL = preSignedURLService.getDownloadUrl(problem.getAttachedFile());
			}
        	return new GetTestProblemResDto(problem, preSignedURL);
        }).collect(Collectors.toList()));

    }

    @PostMapping("/tests/{testId}/problems")
    @AccessTestByProctor
    public ResponseEntity<BooleanResponse> postTestProblem(@PathVariable Long testId, @RequestBody TestProblemReqDto reqDto) {

        Test test = testService.getTest(testId);

        return ResponseEntity.ok().body(BooleanResponse.of(problemService.postTestProblem(test, reqDto)));
    }

    @PutMapping("/tests/{testId}/problems")
    @AccessTestByProctor
    public ResponseEntity<BooleanResponse> putTestProblem(@PathVariable Long testId, @RequestBody TestProblemReqDto reqDto) {
        return ResponseEntity.ok().body(BooleanResponse.of(problemService.putTestProblem(testId, reqDto)));
    }
	
	@DeleteMapping("/tests/{testId}/problems/{problemNum}")
	@AccessTestByProctor
	public ResponseEntity<BooleanResponse> deleteProblem(@PathVariable Long testId, @PathVariable Long problemNum) {
		return ResponseEntity.ok().body(BooleanResponse.of(problemService.deleteTestProblem(testId, problemNum)));
	}

}
