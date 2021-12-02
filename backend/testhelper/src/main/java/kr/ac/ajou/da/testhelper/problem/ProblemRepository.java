package kr.ac.ajou.da.testhelper.problem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
	List<Problem> findByTestId(Long testId);

	Optional<Problem> findByTestIdAndProblemNum(Long testId, Long problemNum);

    boolean existsByTestIdAndProblemNum(Long testId, Long problemNum);

    int countByTestId(Long testId);
}
