package kr.ac.ajou.da.testhelper.common.security.authority;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(value = RetentionPolicy.RUNTIME)
@IsProfessor
public @interface AccessCourseByProfessor {
}
