package kr.ac.ajou.da.testhelper.test.verification;

import kr.ac.ajou.da.testhelper.definition.VerificationStatus;
import kr.ac.ajou.da.testhelper.student.StudentMapper;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.SubmissionService;
import kr.ac.ajou.da.testhelper.test.verification.dto.GetTestStudentVerificationResDto;
import kr.ac.ajou.da.testhelper.test.verification.exception.CannotVerifyWhenTestNotInProgressException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestStudentVerificationService {

    private final SubmissionService submissionService;

    private WebClient webClient;

    @Value("${server.ai}")
    private String aiServerURL;

    @PostConstruct
    public void initWebClient() {
        log.info("initWebClient");
        webClient = WebClient.create(aiServerURL);
    }


    public List<GetTestStudentVerificationResDto> getList(Long testId, Long proctorId) {

        //TODO : refactor later -> 한방에 갈 수 있도록

        List<Submission> submissions = submissionService.getByTestIdAndSupervisedBy(testId, proctorId);

        return submissions.stream()
                .map(submission -> new GetTestStudentVerificationResDto(
                        submission.getTest().getId(),
                        submission.getStudent().getId(),
                        submission.getId(),
                        submission.getVerified()))
                .collect(Collectors.toList());

    }

    @Transactional
    public boolean update(Long testId, Long studentId, Boolean verified) {

        Submission submission = submissionService.getByTestIdAndStudentId(testId, studentId);

        if (!submission.getTest().isInProgress()) {
            throw new CannotVerifyWhenTestNotInProgressException();
        }

        submission.updateVerified(verified);

        return true;
    }

    @Transactional
    public VerificationStatus verification(Long testId, Long studentId) throws SQLException {

        Submission submission = submissionService.getByTestIdAndStudentId(testId, studentId);

        if (!submission.getTest().isInProgress()) {
            throw new CannotVerifyWhenTestNotInProgressException();
        }

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();

        String studentNumber = submission.getStudent().getStudentNumber();
        log.info("Initiate Verification : studentNum = {}, testId = {}", studentNumber, testId);

        formData.add("test_id", String.format("%05d", testId));
        formData.add("student_num", studentNumber);

        String response = webClient.post()
                .uri("/identification")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(String.class)
                .block();

        Boolean result = null;

        try {
            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObj = (JSONObject) jsonParser.parse(response);
            result = (Boolean) jsonObj.get("result");

        } catch (ParseException e) {
            e.printStackTrace();
        }

        submission.updateVerified(result);

        log.info("Verification Result : {}", submission.getVerified());


        return submission.getVerified();

    }
}
