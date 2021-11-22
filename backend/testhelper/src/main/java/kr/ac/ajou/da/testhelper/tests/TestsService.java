package kr.ac.ajou.da.testhelper.tests;

import kr.ac.ajou.da.testhelper.account.AccountMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

@Service
public class TestsService {
	@Autowired
	private TestsMapper testsMapper;
	@Autowired
	private AccountMapper accountMapper;
	
	public List<HashMap<String, Object>> getTests(Long accountId) throws SQLException {
		String role = getAccountRole(accountId);
		
		if(role.equals("PROFESSOR")) {
			return testsMapper.getTestListOfProfessor(accountId);
		} else if(role.equals("ASSISTANT")) {
			return testsMapper.getTestListOfAssistant(accountId);
		}
		
		return null;
	}

	private String getAccountRole(Long accountId) throws SQLException {
		return accountMapper.getAccountRole(accountId);
	}
}
