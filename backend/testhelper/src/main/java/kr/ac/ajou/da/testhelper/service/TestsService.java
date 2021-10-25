package kr.ac.ajou.da.testhelper.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.ac.ajou.da.testhelper.mapper.TestsMapper;

@Service
public class TestsService {
	@Autowired
	private TestsMapper testMapper;
	
	public List<HashMap<String, Object>> getTests() {
		return testMapper.selectTests();
	}
}
