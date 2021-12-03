package kr.ac.ajou.da.testhelper.submission.answer;

import kr.ac.ajou.da.testhelper.problem.Problem;
import kr.ac.ajou.da.testhelper.problem.ProblemService;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.answer.exception.SubmissionAnswerNotFoundException;
import kr.ac.ajou.da.testhelper.submission.exception.SubmissionMarkIncompleteException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SubmissionAnswerService {

    private final SubmissionAnswerRepository submissionAnswerRepository;
    private final ProblemService problemService;

    @Transactional
    public Integer getScore(Long submissionId, Long problemNum) {
        Integer score = 0;
        try {
            score = getAnswer(submissionId, problemNum).getScore();
        } catch (SubmissionAnswerNotFoundException ignured) {
        }

        return score;
    }

    private SubmissionAnswer getAnswer(Long submissionId, Long problemNum) {
        return submissionAnswerRepository.findBySubmissionIdAndProblemNum(submissionId, problemNum)
                .orElseThrow(SubmissionAnswerNotFoundException::new);
    }

    @Transactional
    public void updateScore(Submission submission, Long problemNum, Integer score) {
        SubmissionAnswer answer = null;

        try {
            answer = getAnswer(submission.getId(), problemNum);
        } catch (SubmissionAnswerNotFoundException ex) {
            answer = createAnswer(submission, problemNum);
        }

        answer.updateScore(score);
    }

    private SubmissionAnswer createAnswer(Submission submission, Long problemNum) {
        Problem problem = problemService.getByTestIdAndProblemNum(submission.getTest().getId(), problemNum);

        SubmissionAnswer answer = new SubmissionAnswer(submission, problem);
        submissionAnswerRepository.save(answer);
        return answer;
    }

    @Transactional
    public int getTotalScoreBySubmission(Submission submission) {

        if (isMarkNotComplete(submission)) {
            throw new SubmissionMarkIncompleteException();
        }

        return submission.getAnswers().stream().map(SubmissionAnswer::getScore).reduce(Integer::sum)
                .orElse(0);
    }

    private boolean isMarkNotComplete(Submission submission) {
        int problemCount = problemService.getCountByTestId(submission.getTest().getId());
        return problemCount != submission.getAnswers().size();
    }
}
