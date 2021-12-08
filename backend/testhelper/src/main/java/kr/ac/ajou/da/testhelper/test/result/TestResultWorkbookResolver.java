package kr.ac.ajou.da.testhelper.test.result;

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

        for (TestResultWorkbookHeader header : TestResultWorkbookHeader.values()) {
            headerRow.createCell(header.getColumn()).setCellValue(header.getHeaderName());
        }
    }
}
