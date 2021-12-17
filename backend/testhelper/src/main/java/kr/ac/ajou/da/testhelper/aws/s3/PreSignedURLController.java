package kr.ac.ajou.da.testhelper.aws.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class PreSignedURLController {

    private final PreSignedURLService preSignedURLService;

    @GetMapping(path = "/s3-upload-url")
    public String GetS3UrlUpload(@RequestParam String objectKey) {
        return preSignedURLService.getUploadUrl(objectKey);
    }

    @GetMapping(path = "/s3-download-url")
    public String GetS3UrlDownload(@RequestParam String objectKey) throws IOException {
        return preSignedURLService.getDownloadUrl(objectKey);
    }
}
