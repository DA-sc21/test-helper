package kr.ac.ajou.da.testhelper.test.verification;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.test.verification.dto.GetTestStudentVerificationReqDto;
import kr.ac.ajou.da.testhelper.test.verification.dto.GetTestStudentVerificationResDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TestStudentVerificationController {

    private final TestStudentVerificationService testStudentVerificationService;

    @GetMapping("/tests/{testId}/students/verification")
    public ResponseEntity<List<GetTestStudentVerificationResDto>> getTestStudentVerificationList(@PathVariable Long testId) {

        Account proctor = new Account(1L);

        return ResponseEntity.ok().body(testStudentVerificationService.getList(testId, proctor.getId()));

    }

    @PutMapping("/tests/{testId}/students/{studentId}/verification")
    public ResponseEntity<BooleanResponse> putTestStudentVerification(@PathVariable Long testId,
                                                                      @PathVariable Long studentId,
                                                                      @RequestBody GetTestStudentVerificationReqDto reqDto) {

        return ResponseEntity.ok().body(new BooleanResponse(testStudentVerificationService.update(testId, studentId, reqDto.getVerified())));

    }

}
