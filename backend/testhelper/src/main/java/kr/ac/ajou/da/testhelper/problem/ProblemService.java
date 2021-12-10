package kr.ac.ajou.da.testhelper.problem;

import kr.ac.ajou.da.testhelper.problem.dto.TestProblemReqDto;
import kr.ac.ajou.da.testhelper.problem.exception.ProblemNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProblemService {
	
	private final ProblemRepository problemRepository;
	
	@Transactional
    public List<Problem> getByTestId(Long testId) {

        return problemRepository.findByTestId(testId);

    }
	
	@Transactional
	public Problem getByTestIdAndProblemNum(Long testId, Long problemNum) {
		return problemRepository.findByTestIdAndProblemNum(testId, problemNum)
				.orElseThrow(ProblemNotFoundException::new);
	}

	private boolean existsByTestIdAndProblemNum(Long testId, Long problemNum) {
		return problemRepository.existsByTestIdAndProblemNum(testId, problemNum);
	}

	@Transactional
	public boolean postTestProblem(Long testId, TestProblemReqDto reqDto) {
		if(existsByTestIdAndProblemNum(testId, reqDto.getProblemNum())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "문제가 이미 존재합니다.");
		}
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

    public int getCountByTestId(Long testId) {
		return problemRepository.countByTestId(testId);
    }

    @Transactional
	public boolean deleteTestProblem(Long testId, Long problemNum) {
    	Problem problem = getByTestIdAndProblemNum(testId, problemNum);
    	
    	problemRepository.delete(problem);
    	
		return true;
	}
}
