package kr.ac.ajou.da.testhelper.test.result;

import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessTestByProfessor;
import kr.ac.ajou.da.testhelper.test.result.dto.GetTestResultResDto;
import kr.ac.ajou.da.testhelper.test.result.exception.FailedToCreateTestResultExcelException;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RequiredArgsConstructor
@RestController
public class TestResultController {

    private final TestResultService testResultService;

    @GetMapping("/tests/{testId}/result")
    @AccessTestByProfessor
    public ResponseEntity<GetTestResultResDto> getTestResult(@PathVariable Long testId) {

        return ResponseEntity.ok().body(new GetTestResultResDto(testResultService.get(testId)));
    }

    @GetMapping("/tests/{testId}/result/excel")
    @AccessTestByProfessor
    public void getTestResultExcel(@PathVariable Long testId,
                                   HttpServletResponse response) {

        Workbook workbook = testResultService.createTestResultWorkbook(testId);

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment;");

        try {
            workbook.write(response.getOutputStream());
            workbook.close();

            response.getOutputStream().flush();
            response.getOutputStream().close();

        } catch (IOException ex) {
            throw new FailedToCreateTestResultExcelException();
        }
    }

    @PutMapping("/tests/{testId}/result")
    @AccessTestByProfessor
    public ResponseEntity<BooleanResponse> putTestResult(@PathVariable Long testId) {

        testResultService.updateTestResult(testId);

        return ResponseEntity.ok().body(BooleanResponse.TRUE);
    }

    @PostMapping("/tests/{testId}/grade")
    @AccessTestByProfessor
    public ResponseEntity<BooleanResponse> postTestGrade(@PathVariable Long testId) {

        testResultService.gradeTest(testId);

        return ResponseEntity.ok().body(BooleanResponse.TRUE);
    }
}
