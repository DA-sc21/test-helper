package kr.ac.ajou.da.testhelper.test.result;

import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessTestByProfessor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class TestResultController {

    private final TestResultService testResultService;

    @PostMapping("/tests/{testId}/result")
    @AccessTestByProfessor
    public ResponseEntity<BooleanResponse> postTestResult(@PathVariable Long testId){

        testResultService.grade(testId);

        return ResponseEntity.ok().body(BooleanResponse.TRUE);
    }
}
