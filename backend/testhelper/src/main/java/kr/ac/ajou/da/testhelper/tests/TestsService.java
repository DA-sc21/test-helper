package kr.ac.ajou.da.testhelper.tests;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.ac.ajou.da.testhelper.account.AccountMapper;

@Service
public class TestsService {
	@Autowired
	private TestsMapper testsMapper;
	@Autowired
	private AccountMapper accountMapper;
	
	public List<HashMap<String, Object>> getTests(int accountId, String testStatus) throws SQLException {
		String role = getAccountRole(accountId);
		
		if(role.equals("PROFESSOR")) {
			return testsMapper.getTestListOfProfessor(accountId, testStatus);
		} else if(role.equals("ASSISTANT")) {
			return testsMapper.getTestListOfAssistant(accountId, testStatus);
		}
		
		return null;
	}

	private String getAccountRole(int accountId) throws SQLException {
		return accountMapper.getAccountRole(accountId);
	}
}
