package kr.ac.ajou.da.testhelper.test.result;

import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.test.Test;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

@Component
public class TestResultWorkbookResolver {

    public Workbook resolve(Test test) {
        Workbook testResultWorkbook = new XSSFWorkbook();

        Sheet sheet = testResultWorkbook.createSheet(test.resolveName());

        Row headerRow = sheet.createRow(0);
        this.resolveHeader(headerRow, test);

        for (int i = 0; i < test.getSubmissions().size(); i++) {
            Row row = sheet.createRow(i + 1);
            resolveRow(row, test.getSubmissions().get(i));
        }

        return testResultWorkbook;
    }

    private void resolveHeader(Row headerRow, Test test) {
        for (TestResultWorkbookHeader header : TestResultWorkbookHeader.values()) {
            header.resolveHeader(headerRow, test);
        }
    }

    private void resolveRow(Row row, Submission submission) {
        for (TestResultWorkbookHeader header : TestResultWorkbookHeader.values()) {
            header.resolveRow(row, submission);
        }
    }
}