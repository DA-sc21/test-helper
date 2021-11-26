package kr.ac.ajou.da.testhelper.admin.login;

import kr.ac.ajou.da.testhelper.admin.login.dto.AdminLoginReqDto;
import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AdminLoginController {
    private final AdminLoginService adminLoginService;

    @PostMapping("/admin/sessions")
    public ResponseEntity<BooleanResponse> login(AdminLoginReqDto reqDto){

        adminLoginService.login(reqDto);

        return ResponseEntity.ok().body(BooleanResponse.of(true));

    }

    @DeleteMapping("/admin/sessions")
    public ResponseEntity<BooleanResponse> logout(){

        adminLoginService.logout();

        return ResponseEntity.ok().body(BooleanResponse.of(true));
    }
}
