package kr.ac.ajou.da.testhelper.tests;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestsController {
	@Autowired
	private TestsService testsService;
	    
    @GetMapping("/tests")
    public List<HashMap<String, Object>> getTests(@RequestParam int accountId, @RequestParam String testStatus) throws Exception {
    	return testsService.getTests(accountId, testStatus);
    }
}
