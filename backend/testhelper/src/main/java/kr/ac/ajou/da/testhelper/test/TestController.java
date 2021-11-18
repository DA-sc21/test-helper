package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.test.dto.PutTestStatusReqDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    @GetMapping("/tests")
    public List<HashMap<String, Object>> getTests(@RequestParam int accountId) throws Exception {
        return testService.getTests(accountId);
    }

    @PutMapping("/tests/{testId}/status")
    public ResponseEntity<BooleanResponse> putTestStatus(@PathVariable Long testId,
                                                         PutTestStatusReqDto reqDto){

        Account account = new Account(1L);

        testService.updateStatus(testId, reqDto.getStatus(), account);

        return ResponseEntity.ok().body(new BooleanResponse(true));
    }
}
