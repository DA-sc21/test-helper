package kr.ac.ajou.da.testhelper.aws.credentials;

import com.amazonaws.services.securitytoken.model.Credentials;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest
@Disabled
class AWSTemporaryCredentialServiceIntegrationTest {

    final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private AWSTemporaryCredentialService awsTemporaryCredentialService;

    @Test
    void createSessionToken() {
        //given

        //when
        Credentials credential = awsTemporaryCredentialService.createTemporaryCredential();

        //then
        log.info("Access Key ID : {}", credential.getAccessKeyId());
        log.info("Secret Access Key : {}", credential.getSecretAccessKey());
        log.info("Session Token : {}", credential.getSessionToken());
    }
}