package kr.ac.ajou.da.testhelper;

import kr.ac.ajou.da.testhelper.examinee.Examinee;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.SubmissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class DevelopController {

    private final SubmissionService submissionService;

    @GetMapping("/")
    public String testRun(){
        log.info("Hello World!");
        return "Hello World!";
    }

    @GetMapping("/dev/tests/{testId}/students/{studentId}/password")
    public String getExamineePassword(@PathVariable Long testId,
                                      @PathVariable Long studentId){


        Submission submission = submissionService.getByTestIdAndStudentId(testId, studentId);

        return Examinee.resolvePassword(submission.getId(), studentId, testId);
    }
}
