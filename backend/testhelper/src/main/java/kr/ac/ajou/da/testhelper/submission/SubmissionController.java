package kr.ac.ajou.da.testhelper.submission;

import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.submission.dto.PutSubmissionConsentedReqDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PutMapping("/tests/{testId}/students/{studentId}/submissions/consented")
    public ResponseEntity<BooleanResponse> putSubmissionConsented(@PathVariable Long testId,
                                                                  @PathVariable Long studentId,
                                                                  @RequestBody PutSubmissionConsentedReqDto reqDto){

        return ResponseEntity.ok().body(new BooleanResponse(
                submissionService.updateConsentedByTestIdAndStudentId(testId,studentId,reqDto.getConsented())));
    }
}
