package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessCourseByProfessor;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessTestByProctor;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessTestByProfessor;
import kr.ac.ajou.da.testhelper.common.security.authority.IsAccount;
import kr.ac.ajou.da.testhelper.test.dto.GetDetailedTestResDto;
import kr.ac.ajou.da.testhelper.test.dto.PostTestReqDto;
import kr.ac.ajou.da.testhelper.test.dto.PutTestStatusReqDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    @GetMapping("/tests")
    @IsAccount
    public List<HashMap<String, Object>> getTests(@AuthenticationPrincipal @ApiIgnore Account account) throws Exception {
        return testService.getTests(account.getId());
    }

    @PutMapping("/tests/{testId}/status")
    @AccessTestByProctor
    public ResponseEntity<BooleanResponse> putTestStatus(@PathVariable Long testId,
                                                         PutTestStatusReqDto reqDto,
                                                         @AuthenticationPrincipal @ApiIgnore Account account) {

        testService.updateStatus(testId, reqDto.getStatus(), account);

        return ResponseEntity.ok().body(BooleanResponse.of(true));
    }

    @GetMapping("/tests/{testId}")
    @AccessTestByProfessor
    public ResponseEntity<GetDetailedTestResDto> getTest(@PathVariable Long testId) {

        return ResponseEntity.ok().body(new GetDetailedTestResDto(testService.getTest(testId)));

    }

    @PostMapping("/courses/{courseId}/tests")
    @AccessCourseByProfessor
    public ResponseEntity<BooleanResponse> postTest(@PathVariable Long courseId,
                                                    PostTestReqDto reqDto,
                                                    @AuthenticationPrincipal @ApiIgnore Account account){

        testService.createTest(courseId, reqDto, account.getId());

        return ResponseEntity.ok().body(BooleanResponse.TRUE);
    }
}
