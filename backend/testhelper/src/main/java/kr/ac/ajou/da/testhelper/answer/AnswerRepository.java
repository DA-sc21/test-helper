package kr.ac.ajou.da.testhelper.answer;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

	List<Answer> getAnswerByTestId(Long testId);

}
