package kr.ac.ajou.da.testhelper.cloudconvert;

import com.amazonaws.services.securitytoken.model.Credentials;
import com.cloudconvert.client.CloudConvertClient;
import com.cloudconvert.client.setttings.EnvironmentVariableSettingsProvider;
import com.cloudconvert.dto.request.ConvertFilesTaskRequest;
import com.cloudconvert.dto.request.S3ExportRequest;
import com.cloudconvert.dto.request.S3ImportRequest;
import com.cloudconvert.dto.response.JobResponse;
import com.google.common.collect.ImmutableMap;
import kr.ac.ajou.da.testhelper.aws.credentials.AWSTemporaryCredentialService;
import kr.ac.ajou.da.testhelper.aws.s3.PreSignedURLService;
import kr.ac.ajou.da.testhelper.file.FileConvertService;
import kr.ac.ajou.da.testhelper.file.exception.FailedToConvertFileException;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.submission.definition.SubmissionType;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class CloudConvertFileConvertService implements FileConvertService {

    private final CloudConvertClient cloudConvertClient;
    private final AWSTemporaryCredentialService credentialService;

    public CloudConvertFileConvertService(AWSTemporaryCredentialService credentialService) throws IOException {
        this.cloudConvertClient = new CloudConvertClient(new EnvironmentVariableSettingsProvider());
        this.credentialService = credentialService;
    }

    @Override
    public void convertToMp4(Submission submission, SubmissionType submissionType) {

        Credentials credential = credentialService.createTemporaryCredential();

        try {
            JobResponse body = cloudConvertClient.jobs().create(
                    ImmutableMap.of(
                            "import", new S3ImportRequest()
                                    .setBucket(PreSignedURLService.BUCKET_NAME)
                                    .setRegion("us-east-2")
                                    .setAccessKeyId(credential.getAccessKeyId())
                                    .setSecretAccessKey(credential.getSecretAccessKey())
                                    .setSessionToken(credential.getSessionToken())
                                    .setKey(submissionType.resolveSubmissionPath(submission, false)),
                            "convert", new ConvertFilesTaskRequest()
                                    .setInput("import")
                                    .setInputFormat("webm")
                                    .setOutputFormat("mp4"),
                            "export", new S3ExportRequest()
                                    .setInput("convert")
                                    .setBucket(PreSignedURLService.BUCKET_NAME)
                                    .setRegion("us-east-2")
                                    .setAccessKeyId(credential.getAccessKeyId())
                                    .setSecretAccessKey(credential.getSecretAccessKey())
                                    .setSessionToken(credential.getSessionToken())
                                    .setKey(submissionType.resolveSubmissionPath(submission))
                    )
            ).getBody();
        } catch (Exception e) {
            throw new FailedToConvertFileException(submission.getStudent().getId(), submission.getTest().getId(), submissionType);
        }
    }
}
