package kr.ac.ajou.da.testhelper.email;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "email")
@Getter
@Setter
class EmailProperties {

    private String username;
    private String password;

}
