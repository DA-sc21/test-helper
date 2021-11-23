package kr.ac.ajou.da.testhelper.account;

import kr.ac.ajou.da.testhelper.account.dto.GetAssistantsReqDto;
import kr.ac.ajou.da.testhelper.account.dto.GetAssistantsResDto;
import kr.ac.ajou.da.testhelper.common.security.authority.IsProfessor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping("/assistants")
    @IsProfessor
    public ResponseEntity<List<GetAssistantsResDto>> getAssistants(GetAssistantsReqDto reqDto){
        ArrayList<GetAssistantsResDto> assistants = new ArrayList<>();
        assistants.add(new GetAssistantsResDto(1L, "name","email"));
        return ResponseEntity.ok().body(assistants);
    }

}