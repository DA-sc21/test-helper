package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.test.dto.PutTestStatusReqDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    @PutMapping("/tests/{testId}/status")
    public ResponseEntity<BooleanResponse> putTestStatus(@PathVariable Long testId,
                                                         PutTestStatusReqDto reqDto){

        testService.updateStatus(testId, reqDto.getStatus());

        return ResponseEntity.ok().body(new BooleanResponse(true));
    }
}
