package kr.ac.ajou.da.testhelper.submission;

import kr.ac.ajou.da.testhelper.submission.definition.SubmissionType;
import kr.ac.ajou.da.testhelper.submission.dto.GetSubmissionUploadUrlResDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @GetMapping("/tests/{testId}/submissions")
    public List<HashMap<String, Object>> getSubmissionStatus(@PathVariable int testId,
                                                             @RequestParam(required = false, defaultValue = "0") int studentId) throws SQLException {
        return submissionService.getSubmissionStatus(testId, studentId);
    }

    @GetMapping("/tests/{testId}/students/{studentId}/submissions/{submissionType}/upload-url")
    public ResponseEntity<GetSubmissionUploadUrlResDto> getSubmissionUploadUrl(@PathVariable Long testId,
                                                                               @PathVariable Long studentId,
                                                                               @PathVariable SubmissionType submissionType) {

        return ResponseEntity.ok().body(new GetSubmissionUploadUrlResDto(
                submissionService.getUploadUrlByTestIdAndStudentIdAndSubmissionType(testId, studentId, submissionType)));

    }

}
