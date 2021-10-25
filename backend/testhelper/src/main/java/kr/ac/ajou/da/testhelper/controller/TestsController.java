package kr.ac.ajou.da.testhelper.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.ac.ajou.da.testhelper.service.TestsService;

@RestController
public class TestsController {
	@Autowired
	private TestsService testService;
	    
    @GetMapping("/tests")
    public List<HashMap<String, Object>> getTests() {
    	return testService.getTests();
    }
}
