package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.common.security.authority.IsProctor;
import kr.ac.ajou.da.testhelper.test.dto.PutTestStatusReqDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    @GetMapping("/tests")
    @IsProctor
    public List<HashMap<String, Object>> getTests(@AuthenticationPrincipal @ApiIgnore Account account) throws Exception {
        return testService.getTests(account.getId());
    }

    @PutMapping("/tests/{testId}/status")
    @IsProctor
    public ResponseEntity<BooleanResponse> putTestStatus(@PathVariable Long testId,
                                                         PutTestStatusReqDto reqDto,
                                                         @AuthenticationPrincipal @ApiIgnore Account account){

        testService.updateStatus(testId, reqDto.getStatus(), account);

        return ResponseEntity.ok().body(BooleanResponse.of(true));
    }
}
