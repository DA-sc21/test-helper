package kr.ac.ajou.da.testhelper.tests;

import kr.ac.ajou.da.testhelper.common.security.authority.IsProctor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
public class TestsController {
	@Autowired
	private TestsService testsService;
	    
    @GetMapping("/tests")
    @IsProctor
    public List<HashMap<String, Object>> getTests(@RequestParam int accountId) throws Exception {
    	return testsService.getTests(accountId);
    }
}
