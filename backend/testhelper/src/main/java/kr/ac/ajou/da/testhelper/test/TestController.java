package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.common.exception.InvalidInputException;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessCourseByProfessor;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessTestByProctor;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessTestByProfessor;
import kr.ac.ajou.da.testhelper.common.security.authority.IsAccount;
import kr.ac.ajou.da.testhelper.test.definition.TestType;
import kr.ac.ajou.da.testhelper.test.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    @GetMapping("/tests")
    @IsAccount
    public List<GetTestsResDto> getTests(GetTestsReqDto reqDto,
                                         @AuthenticationPrincipal @ApiIgnore Account account) throws Exception {
        return testService.getTests(account, reqDto.getTestStatus().getTestStatus())
                .stream().map(GetTestsResDto::new).collect(Collectors.toList());
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
    public ResponseEntity<PostTestResDto> postTest(@PathVariable Long courseId,
                                                   PostAndPatchTestReqDto reqDto,
                                                   @AuthenticationPrincipal @ApiIgnore Account account) {

        validate(reqDto);

        Test test = testService.createTest(courseId, reqDto.toCreateDto(), account.getId());

        return ResponseEntity.ok().body(new PostTestResDto(test.getId()));
    }

    @PatchMapping("/tests/{testId}")
    @AccessTestByProfessor
    public ResponseEntity<BooleanResponse> patchTest(@PathVariable Long testId,
                                                     PostAndPatchTestReqDto reqDto,
                                                     @AuthenticationPrincipal @ApiIgnore Account account) {

        validate(reqDto);

        testService.updateTest(testId, reqDto.toCreateDto(), account.getId());

        return ResponseEntity.ok().body(BooleanResponse.TRUE);

    }

    @DeleteMapping("/tests/{testId}")
    @AccessTestByProfessor
    public ResponseEntity<BooleanResponse> deleteTest(@PathVariable Long testId) {

        testService.deleteTest(testId);

        return ResponseEntity.ok().body(BooleanResponse.TRUE);

    }

    @PostMapping("/tests/{testId}/invitation")
    @AccessTestByProfessor
    public ResponseEntity<BooleanResponse> postTestInvitation(@PathVariable Long testId) {


        testService.sendTestInvitation(testId);

        return ResponseEntity.ok().body(BooleanResponse.TRUE);
    }

    private void validate(PostAndPatchTestReqDto reqDto) {

        try{
            TestType.valueOf(reqDto.getType());
        }catch (Exception ex){
            throw new InvalidInputException("???????????? ?????? ?????? ???????????????.");
        }

        if (!LocalDateTime.now().isBefore(reqDto.getStartTime())) {
            throw new InvalidInputException("?????? ????????? ?????? ????????? ??????????????????");
        }

        if (!reqDto.getStartTime().isBefore(reqDto.getEndTime())) {
            throw new InvalidInputException("??????????????? ???????????? ?????? ??????????????????.");
        }
    }
}
