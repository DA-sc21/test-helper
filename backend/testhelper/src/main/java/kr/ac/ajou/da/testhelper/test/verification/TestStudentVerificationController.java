package kr.ac.ajou.da.testhelper.test.verification;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessExaminee;
import kr.ac.ajou.da.testhelper.common.security.authority.IsProctor;
import kr.ac.ajou.da.testhelper.test.verification.dto.GetTestStudentVerificationReqDto;
import kr.ac.ajou.da.testhelper.test.verification.dto.GetTestStudentVerificationResDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class TestStudentVerificationController {

    private final TestStudentVerificationService testStudentVerificationService;

    @GetMapping("/tests/{testId}/students/verification")
    @IsProctor
    public ResponseEntity<List<GetTestStudentVerificationResDto>> getTestStudentVerificationList(@PathVariable Long testId,
                                                                                                 @AuthenticationPrincipal @ApiIgnore Account account) {

        return ResponseEntity.ok().body(testStudentVerificationService.getList(testId, account.getId()));

    }

    @PutMapping("/tests/{testId}/students/{studentId}/verification")
    @IsProctor
    public ResponseEntity<BooleanResponse> putTestStudentVerification(@PathVariable Long testId,
                                                                      @PathVariable Long studentId,
                                                                      @RequestBody GetTestStudentVerificationReqDto reqDto) {

        return ResponseEntity.ok().body(BooleanResponse.of(testStudentVerificationService.update(testId, studentId, reqDto.getVerified())));

    }
    
    @PostMapping("/tests/{testId}/students/{studentId}/verification")
    @AccessExaminee
    public String postTestStudentVerification(@PathVariable int testId, @PathVariable int studentId) throws SQLException {
    	return testStudentVerificationService.verification(testId, studentId);
    }

}
