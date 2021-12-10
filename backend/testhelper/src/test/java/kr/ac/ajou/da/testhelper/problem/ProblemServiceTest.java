package kr.ac.ajou.da.testhelper.problem;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;


import kr.ac.ajou.da.testhelper.common.dummy.DummyFactory;

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
	
	private final Problem problem = new Problem(1L, 1L, DummyFactory.createTest(), "1+1", 20L, null);

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
	void getByTestId_success() {

		//given
        when(problemRepository.findByTestId(anyLong())).thenReturn(problems);

        //when
        List<Problem> res = problemService.getByTestId(testId);

        //then
        verify(problemRepository, times(1)).findByTestId(anyLong());

        assertEquals(problems, res);

	}
	
	@Test
	void getByTestIdAndProblemNum_success() {
		//given
		when(problemRepository.findByTestIdAndProblemNum(anyLong(), anyLong())).thenReturn(Optional.of(problem));
		
		//when
		Problem res = problemService.getByTestIdAndProblemNum(1L, 1L);
		
		//then
		verify(problemRepository, times(1)).findByTestIdAndProblemNum(anyLong(), anyLong());
		assertEquals(problem, res);
	}
	
	@Test
	void createProblem_success() {
		//given
		when(problemRepository.getById(anyLong())).thenReturn(problem);

		//when
		problemService.createProblem(problem);
		
		//then
		verify(problemRepository, times(1)).save(problem);
		assertEquals(problemRepository.getById(problem.getId()), problem);
	}
	
	@Test
    void deleteProblem_success() {
    	//given
		Problem problem = DummyFactory.createProblem();

		when(problemRepository.findById(anyLong())).thenReturn(null);

        //when
		problemService.deleteProblem(problem);
    	
        //then
		verify(problemRepository, times(1)).delete(problem);
		assertThat(problemRepository.findById(problem.getId())).isNull();
    }
		
}
