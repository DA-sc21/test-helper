package kr.ac.ajou.da.testhelper.problem;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.LinkedList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

class ProblemServiceTest {
	
	@InjectMocks
	private ProblemService problemService;
	
	@Mock
	private ProblemRepository problemRepository;
	
	@Mock
	private ProblemMapper problemMapper;
	
	private final Problem problem = new Problem(1L, 1L, 1L, "1+1", 20L, null);
    private final List<Problem> problems = new LinkedList<>();
    private final long testId = 1L;
	
    @BeforeEach
	void setup() {
		problemRepository = mock(ProblemRepository.class);
		problemMapper = mock(ProblemMapper.class);
		problemService = new ProblemService(problemRepository, problemMapper);		
		problems.add(problem);
	}
	
	@Test
	@DisplayName("문제 조회 테스트")
	void testFindProblemByTestId() {

		//given
        when(problemRepository.findByTestId(anyLong())).thenReturn(problems);

        //when
        List<Problem> res = problemService.getByTestId(testId);

        //then
        verify(problemRepository, times(1)).findByTestId(anyLong());

        assertEquals(problems, res);

	}
}
