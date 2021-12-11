package kr.ac.ajou.da.testhelper.problem.dto;

import kr.ac.ajou.da.testhelper.problem.Problem;
import lombok.Getter;

@Getter
public class GetTestProblemResDto {
    private final Long id;
    private final Long problemNum;
    private final String question;
    private final Long point;
    private final String attachedFile;

    public GetTestProblemResDto(Problem problem, String attachedFileDownloadUrl) {
        this.id = problem.getId();
        this.problemNum = problem.getProblemNum();
        this.question = problem.getQuestion();
        this.point = problem.getPoint();
        this.attachedFile = attachedFileDownloadUrl;
    }
}
