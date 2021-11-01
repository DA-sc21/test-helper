package kr.ac.ajou.da.testhelper.submission;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SubmissionController {
	@Autowired
	private SubmissionService submissionService;
	
	@GetMapping("/tests/{testId}/submissions")
    public List<HashMap<String, Object>> getSubmission(@PathVariable int testId, @RequestParam(required = false, defaultValue = "0") int studentId) throws SQLException {
    	return submissionService.getSubmission(testId, studentId);
    }
}
