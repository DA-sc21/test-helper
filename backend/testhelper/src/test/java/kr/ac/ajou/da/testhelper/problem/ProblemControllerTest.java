package kr.ac.ajou.da.testhelper.problem;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;

class ProblemControllerTest {
	
	@Autowired
	MockMvc mvc;
	
	@MockBean
	ProblemService problemService;

	@Test
	@DisplayName("문제 조회 테스트")
	void getProblemListByTestId() throws Exception {
		List<Problem> problems = new ArrayList<>();
		Problem problem = new Problem();
		problems.add(problem);
		
		given(problemService.getByTestId(1L)).willReturn(problems);
		
		this.mvc.perform(get("/tests/1/problems"))
				.andExpect(status().isOk());
	}
	
}
