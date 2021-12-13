package kr.ac.ajou.da.testhelper.submission;

import kr.ac.ajou.da.testhelper.common.dto.BooleanResponse;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessExaminee;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessTestByProctor;
import kr.ac.ajou.da.testhelper.common.security.authority.AccessTestByProfessor;
import kr.ac.ajou.da.testhelper.submission.definition.SubmissionStatus;
import kr.ac.ajou.da.testhelper.submission.definition.SubmissionType;
import kr.ac.ajou.da.testhelper.submission.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @GetMapping("/tests/{testId}/submissions")
    @AccessTestByProctor
    public ResponseEntity<List<GetSubmissionResDto>> getSubmissions(@PathVariable Long testId,
                                                                    GetSubmissionReqDto reqDto) {
        return ResponseEntity.ok().body(
                submissionService.getByTestIdAndStudentNumber(testId, reqDto.getStudentNumber())
                        .stream().map(GetSubmissionResDto::new).collect(Collectors.toList())
        );
    }

    @GetMapping("/tests/{testId}/students/{studentId}/submissions")
    @AccessTestByProctor
    public ResponseEntity<GetDetailedSubmissionResDto> getSubmission(@PathVariable Long testId,
                                                                     @PathVariable Long studentId,
                                                                     GetDetailedSubmissionReqDto reqDto) {

        return ResponseEntity.ok().body(
                submissionService.getDetailedByTestIdAndStudentId(testId, studentId, reqDto.getIncludeCapture()));
    }

    @GetMapping("/tests/{testId}/students/{studentId}/submissions/{submissionType}/upload-url")
    @AccessExaminee
    public ResponseEntity<GetSubmissionUploadUrlResDto> getSubmissionUploadUrl(@PathVariable Long testId,
                                                                               @PathVariable Long studentId,
                                                                               @PathVariable SubmissionType submissionType) {

        return ResponseEntity.ok().body(new GetSubmissionUploadUrlResDto(
                submissionService.getUploadUrlByTestIdAndStudentIdAndSubmissionType(testId, studentId, submissionType)));

    }

    @PostMapping("/tests/{testId}/students/{studentId}/submissions/{submissionType}")
    @AccessExaminee
    public ResponseEntity<BooleanResponse> postSubmission(@PathVariable Long testId,
                                                          @PathVariable Long studentId,
                                                          @PathVariable SubmissionType submissionType) {

        submissionService.uploadSubmission(testId, studentId, submissionType);

        return ResponseEntity.ok().body(BooleanResponse.TRUE);

    }

    @PutMapping("/tests/{testId}/students/{studentId}/submissions/consented")
    @AccessExaminee
    public ResponseEntity<BooleanResponse> putSubmissionConsented(@PathVariable Long testId,
                                                                  @PathVariable Long studentId,
                                                                  @RequestBody PutSubmissionConsentedReqDto reqDto) {

        return ResponseEntity.ok().body(BooleanResponse.of(
                submissionService.updateConsentedByTestIdAndStudentId(testId, studentId, reqDto.getConsented())));
    }

    @PutMapping("/tests/{testId}/students/{studentId}/submissions/submitted")
    @AccessExaminee
    public ResponseEntity<BooleanResponse> putSubmissionSubmitted(@PathVariable Long testId,
                                                                  @PathVariable Long studentId,
                                                                  @RequestBody PutSubmissionSubmittedReqDto reqDto) {

        submissionService.updateStatusByTestIdAndStudentId(testId, studentId, SubmissionStatus.DONE);

        return ResponseEntity.ok().body(BooleanResponse.TRUE);
    }

    @PostMapping("/tests/{testId}/students/{studentId}/submissions/marked")
    @AccessTestByProfessor
    public ResponseEntity<BooleanResponse> putSubmissionStatus(@PathVariable Long testId,
                                                               @PathVariable Long studentId) {

        submissionService.updateStatusByTestIdAndStudentId(testId, studentId, SubmissionStatus.MARKED);

        return ResponseEntity.ok().body(BooleanResponse.TRUE);
    }
    
    @GetMapping("/tests/{testId}/students/{studentId}/submissions/{submissionType}/download-url")
    @AccessTestByProfessor
    public ResponseEntity<GetSubmissionDownloadUrlResDto> getSubmissionDownloadUrl(@PathVariable Long testId,
                                                                               @PathVariable Long studentId,
                                                                               @PathVariable SubmissionType submissionType) {

        return ResponseEntity.ok().body(new GetSubmissionDownloadUrlResDto(
                submissionService.getDownloadUrlByTestIdAndStudentIdAndSubmissionType(testId, studentId, submissionType)));

    }
    
    @GetMapping("/tests/{testId}/students/{studentId}/submissions/status")
    @AccessExaminee
    public ResponseEntity<GetSubmissionStatusResDto> getSubmissionStatus(@PathVariable Long testId,
                                                                  @PathVariable Long studentId) {

    	return ResponseEntity.ok().body(submissionService.getStatus(testId, studentId));
    }

}