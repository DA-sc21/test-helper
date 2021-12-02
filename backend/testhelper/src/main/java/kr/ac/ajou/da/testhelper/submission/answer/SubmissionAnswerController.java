package kr.ac.ajou.da.testhelper.submission.answer;

import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.submission.answer.dto.GetSubmissionProblemScoreResDto;
import kr.ac.ajou.da.testhelper.submission.answer.dto.PutSubmissionProblemScoreReqDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class SubmissionAnswerController {

    private final SubmissionAnswerService submissionAnswerService;

    @GetMapping("/submissions/{submissionId}/problems/{problemNum}/score")
    public ResponseEntity<GetSubmissionProblemScoreResDto> getSubmissionProblemScore(@PathVariable Long submissionId,
                                                                                     @PathVariable Long problemNum) {

        return ResponseEntity.ok().body(new GetSubmissionProblemScoreResDto(submissionAnswerService.getScore(submissionId, problemNum)));
    }

    @PutMapping("/submissions/{submissionId}/problems/{problemNum}/score")
    public ResponseEntity<BooleanResponse> putSubmissionProblemScore(@PathVariable Long submissionId,
                                                                     @PathVariable Long problemNum,
                                                                     PutSubmissionProblemScoreReqDto reqDto) {

        submissionAnswerService.updateScore(submissionId, problemNum, reqDto.getScore());

        return ResponseEntity.ok().body(BooleanResponse.TRUE);
    }
}
