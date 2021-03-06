package kr.ac.ajou.da.testhelper.common.security.authority;

import org.springframework.security.access.annotation.Secured;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Secured({"ROLE_PROFESSOR", "ROLE_ASSISTANT"})
public @interface IsAccount {
}
