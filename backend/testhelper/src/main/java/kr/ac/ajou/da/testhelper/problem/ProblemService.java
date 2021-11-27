package kr.ac.ajou.da.testhelper.problem;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import kr.ac.ajou.da.testhelper.problem.dto.TestProblemReqDto;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProblemService {
	
	private final ProblemRepository problemRepository;
	
	@Transactional
    public List<Problem> getByTestId(Long testId) {

        return problemRepository.findByTestId(testId);

    }
	
	@Transactional
	private Problem getByTestIdAndProblemNum(Long testId, Long problemNum) {
		return problemRepository.findByTestIdAndProblemNum(testId, problemNum);
	}

	@Transactional
	public boolean postTestProblem(Long testId, TestProblemReqDto reqDto) {
		Problem problem = new Problem(reqDto.getProblemNum(), testId, reqDto.getQuestion(), reqDto.getPoint(), reqDto.getAttachedFile());
		problemRepository.save(problem);
		return true;
	}

	@Transactional
	public boolean putTestProblem(Long testId, TestProblemReqDto reqDto) {
		Problem problem = getByTestIdAndProblemNum(testId, reqDto.getProblemNum());
		
		problem.updateTestProblem(reqDto);
		
		return true;
	}

}
