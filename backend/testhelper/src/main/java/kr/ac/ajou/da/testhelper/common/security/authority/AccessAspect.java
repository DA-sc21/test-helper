package kr.ac.ajou.da.testhelper.common.security.authority;

import kr.ac.ajou.da.testhelper.common.security.exception.NotAuthorizedException;
import kr.ac.ajou.da.testhelper.examinee.Examinee;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AccessAspect {

    @Before("execution(* kr.ac.ajou.da.testhelper..*Controller.*(..)) " +
            "&& @annotation(AccessExaminee)")
    public void hasAccessToExaminee(JoinPoint joinPoint) {

        Long testId = resolveTestId(joinPoint);
        Long studentId = resolveStudentId(joinPoint);

        Examinee examinee = resolveExaminee();


        if (!(testId.equals(examinee.getTest().getId()) && studentId.equals(examinee.getStudent().getId()))) {
            throw new NotAuthorizedException();
        }

    }

    private Long resolveTestId(JoinPoint joinPoint) {
        return (Long) resolveParameter("testId", joinPoint);
    }

    private Long resolveStudentId(JoinPoint joinPoint) {
        return (Long) resolveParameter("studentId", joinPoint);
    }

    private Examinee resolveExaminee() {
        return (Examinee) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private Object resolveParameter(String parameterName, JoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String[] parameterNames = signature.getParameterNames();
        Object[] args = joinPoint.getArgs();

        for (int i = 0; i < parameterNames.length; i++) {
            if (parameterName.equals(parameterNames[i])) return args[i];
        }
        return null;
    }

}
