package kr.ac.ajou.da.testhelper.test.result.dto;

import kr.ac.ajou.da.testhelper.test.result.TestResult;
import lombok.Getter;

@Getter
public class GetTestResultResDto {
    private final Integer min;
    private final Integer max;
    private final Double average;

    public GetTestResultResDto(TestResult result) {
        this.min = result.getMinScore();
        this.max = result.getMaxScore();
        this.average = result.getAverage();
    }
}
