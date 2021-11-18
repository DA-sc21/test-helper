package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.test.dto.PutTestStatusReqDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @PutMapping("/tests/{testId}/status")
    public ResponseEntity<BooleanResponse> putTestStatus(PutTestStatusReqDto reqDto){
        return ResponseEntity.ok().body(new BooleanResponse(true));
    }
}
