package kr.ac.ajou.da.testhelper.test.result;

import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.test.Test;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;

@RequiredArgsConstructor
@Getter
public enum TestResultWorkbookHeader {
    STUDENT_NAME(0, "학생 이름") {
        @Override
        void resolveRow(Row row, Submission submission) {
            row.createCell(this.getColumn())
                    .setCellValue(submission.getStudent().getName());
        }
    },
    STUDENT_NUMBER(1, "학번") {
        @Override
        void resolveRow(Row row, Submission submission) {
            row.createCell(this.getColumn())
                    .setCellValue(submission.getStudent().getStudentNumber());
        }
    },
    TOTAL_SCORE(2, "총 점수") {
        @Override
        void resolveRow(Row row, Submission submission) {
            row.createCell(this.getColumn())
                    .setCellValue(submission.getScore());
        }
    },
    PROBLEM_SCORE(3, "문제별 점수") {
        @Override
        void resolveRow(Row row, Submission submission) {
            for(int i =0; i<submission.getAnswers().size(); i++){
                row.createCell(this.getColumn()+i)
                        .setCellValue(submission.getAnswers().get(i).getScore());
            }
        }
    };

    private final int column;
    private final String headerName;

    public int getColumn() {
        return column;
    }

    public void resolveHeader(Row row, Test test){

    }

    abstract void resolveRow(Row row, Submission submission);
}
