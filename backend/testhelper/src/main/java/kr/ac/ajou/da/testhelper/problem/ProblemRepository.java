package kr.ac.ajou.da.testhelper.problem;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
	List<Problem> findByTestId(Long testId);

	Optional<Problem> findByTestIdAndProblemNum(Long testId, Long problemNum);
}
