package kr.ac.ajou.da.testhelper.test.result;

import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessTestByProfessor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class TestResultController {

    private final TestResultService testResultService;

    @PutMapping("/tests/{testId}/result")
    @AccessTestByProfessor
    public ResponseEntity<BooleanResponse> putTestResult(@PathVariable Long testId){

        testResultService.updateTestResult(testId);

        return ResponseEntity.ok().body(BooleanResponse.TRUE);
    }

    @PostMapping("/tests/{testId}/grade")
    @AccessTestByProfessor
    public ResponseEntity<BooleanResponse> postTestGrade(@PathVariable Long testId){

        testResultService.gradeTest(testId);

        return ResponseEntity.ok().body(BooleanResponse.TRUE);
    }
}
