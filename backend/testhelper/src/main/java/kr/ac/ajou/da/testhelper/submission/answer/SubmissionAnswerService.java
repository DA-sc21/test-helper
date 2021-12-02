package kr.ac.ajou.da.testhelper.submission.answer;

import kr.ac.ajou.da.testhelper.problem.Problem;
import kr.ac.ajou.da.testhelper.problem.ProblemService;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.SubmissionService;
import kr.ac.ajou.da.testhelper.submission.answer.exception.SubmissionAnswerNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SubmissionAnswerService {

    private final SubmissionAnswerRepository submissionAnswerRepository;
    private final SubmissionService submissionService;
    private final ProblemService problemService;

    @Transactional
    public Integer getScore(Long submissionId, Long problemNum){
        Integer score = 0;
        try{
            score = getAnswer(submissionId, problemNum).getScore();
        }catch (SubmissionAnswerNotFoundException ignured){}

        return score;
    }

    private SubmissionAnswer getAnswer(Long submissionId, Long problemNum) {
        return submissionAnswerRepository.findBySubmissionIdAndProblemNum(submissionId, problemNum)
                .orElseThrow(SubmissionAnswerNotFoundException::new);
    }

    @Transactional
    public void updateScore(Long submissionId, Long problemNum, Integer score) {
        SubmissionAnswer answer = null;

        try{
            answer = getAnswer(submissionId, problemNum);
        }catch (SubmissionAnswerNotFoundException ex){
            answer = createAnswer(submissionId, problemNum);
        }

        answer.updateScore(score);
    }

    private SubmissionAnswer createAnswer(Long submissionId, Long problemNum) {
        Submission submission = submissionService.getById(submissionId);
        Problem problem = problemService.getByTestIdAndProblemNum(submission.getTest().getId(), problemNum);

        SubmissionAnswer answer = new SubmissionAnswer(submission,problem);
        submissionAnswerRepository.save(answer);
        return answer;
    }

}
