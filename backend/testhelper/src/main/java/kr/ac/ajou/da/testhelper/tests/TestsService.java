package kr.ac.ajou.da.testhelper.tests;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TestsService {
	@Autowired
	private TestsMapper testsMapper;
	
	public List<HashMap<String, Object>> getTests(int accountId, String accountRole, String testStatus) throws SQLException {
		return testsMapper.getTestList(accountId, accountRole, testStatus);
	}
}
