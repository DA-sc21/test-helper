package kr.ac.ajou.da.testhelper.examinee.login;

import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.common.security.authority.IsExaminee;
import kr.ac.ajou.da.testhelper.examinee.login.dto.ExamineeLoginReqDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ExamineeLoginController {
    private final ExamineeLoginService examineeLoginService;

    @PostMapping("examinee/sessions")
    public ResponseEntity<BooleanResponse> login(ExamineeLoginReqDto reqDto){

        examineeLoginService.login(reqDto);

        return ResponseEntity.ok().body(BooleanResponse.of(true));

    }

    @DeleteMapping("examinee/sessions")
    @IsExaminee
    public ResponseEntity<BooleanResponse> logout(){

        examineeLoginService.logout();

        return ResponseEntity.ok().body(BooleanResponse.of(true));
    }
}
