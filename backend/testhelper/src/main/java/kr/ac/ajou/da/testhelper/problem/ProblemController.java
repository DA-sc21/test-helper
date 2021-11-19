package kr.ac.ajou.da.testhelper.problem;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ProblemController {
	
	private final ProblemService problemService;
	
	@GetMapping("/tests/{testId}/problems")
    public ResponseEntity<List<Problem>> getTestProblem(@PathVariable Long testId) {

        return ResponseEntity.ok().body(problemService.getByTestId(testId));

    }

}
