package kr.ac.ajou.da.testhelper;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class HelloController {
    @GetMapping("/")
    public String testRun(){
        log.info("Hello World!");
        return "Hello World!";
    }
}
