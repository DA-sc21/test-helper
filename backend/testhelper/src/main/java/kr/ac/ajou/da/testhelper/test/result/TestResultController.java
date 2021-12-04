package kr.ac.ajou.da.testhelper.test.result;

import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessTestByProfessor;
import kr.ac.ajou.da.testhelper.test.result.dto.GetTestResultResDto;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class TestResultController {

    private final TestResultService testResultService;

    @GetMapping("/tests/{testId}/result")
    @AccessTestByProfessor
    public ResponseEntity<GetTestResultResDto> getTestResult(@PathVariable Long testId){

        return ResponseEntity.ok().body(new GetTestResultResDto(testResultService.get(testId)));
    }
  
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
