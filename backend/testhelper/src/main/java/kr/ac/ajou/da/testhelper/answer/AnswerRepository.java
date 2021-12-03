package kr.ac.ajou.da.testhelper.answer;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import kr.ac.ajou.da.testhelper.answer.dto.ProblemWithAnswer;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

	List<Answer> getAnswerByTestId(Long testId);

}
