package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.common.exception.InvalidInputException;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessCourseByProfessor;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessTestByProctor;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessTestByProfessor;
import kr.ac.ajou.da.testhelper.common.security.authority.IsAccount;
import kr.ac.ajou.da.testhelper.test.dto.GetDetailedTestResDto;
import kr.ac.ajou.da.testhelper.test.dto.PostAndPatchTestReqDto;
import kr.ac.ajou.da.testhelper.test.dto.PutTestStatusReqDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.time.LocalDateTime;
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
                                                    PostAndPatchTestReqDto reqDto,
                                                    @AuthenticationPrincipal @ApiIgnore Account account) {

        validate(reqDto);

        testService.createTest(courseId, reqDto, account.getId());

        return ResponseEntity.ok().body(BooleanResponse.TRUE);
    }

    @PatchMapping("/tests/{testId}")
    @AccessTestByProfessor
    public ResponseEntity<BooleanResponse> patchTest(@PathVariable Long testId,
                                                     PostAndPatchTestReqDto reqDto,
                                                     @AuthenticationPrincipal @ApiIgnore Account account){

        validate(reqDto);

        testService.updateTest(testId, reqDto, account.getId());

        return ResponseEntity.ok().body(BooleanResponse.TRUE);

    }

    private void validate(PostAndPatchTestReqDto reqDto) {
        if (!LocalDateTime.now().isBefore(reqDto.getStartTime())) {
            throw new InvalidInputException("시작 시간을 현재 이후로 설정해주세요");
        }

        if (!reqDto.getStartTime().isBefore(reqDto.getEndTime())) {
            throw new InvalidInputException("종료시간을 시작시간 후로 설정해주세요.");
        }
    }
}
