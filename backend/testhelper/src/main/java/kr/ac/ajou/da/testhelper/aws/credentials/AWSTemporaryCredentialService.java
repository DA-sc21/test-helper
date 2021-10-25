package kr.ac.ajou.da.testhelper.aws.credentials;

import com.amazonaws.services.securitytoken.AWSSecurityTokenService;
import com.amazonaws.services.securitytoken.AWSSecurityTokenServiceClientBuilder;
import com.amazonaws.services.securitytoken.model.Credentials;
import com.amazonaws.services.securitytoken.model.GetSessionTokenRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AWSTemporaryCredentialService {

    private static final int TEMPORARY_CREDENTIALS_DURATION = 900;
    private final AWSSecurityTokenService stsClient;

    public AWSTemporaryCredentialService() {
        this.stsClient = AWSSecurityTokenServiceClientBuilder.standard().build();
    }

    public Credentials createTemporaryCredential() {
        GetSessionTokenRequest req = new GetSessionTokenRequest();
        req.setDurationSeconds(TEMPORARY_CREDENTIALS_DURATION);
        Credentials credentials = stsClient.getSessionToken(req).getCredentials();
        log.info("Create Temporary Credential : {}", credentials.getAccessKeyId());
        return credentials;
    }


}
