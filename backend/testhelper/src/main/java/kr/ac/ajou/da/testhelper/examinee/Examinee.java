package kr.ac.ajou.da.testhelper.examinee;

import kr.ac.ajou.da.testhelper.student.Student;
import kr.ac.ajou.da.testhelper.test.Test;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.xml.bind.DatatypeConverter;
import java.security.MessageDigest;
import java.util.Collection;
import java.util.Collections;

@Getter
@Setter(AccessLevel.PRIVATE)
@NoArgsConstructor
@Entity
@Table(name = "Submission")
public class Examinee implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private Test test;

    @Column(nullable = false)
    private Long supervisedBy;


    public Examinee(Long id, Student student, Test test, Long supervisedBy) {
        this.id = id;
        this.student = student;
        this.test = test;
        this.supervisedBy = supervisedBy;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("STUDENT"));
    }

    @Override
    public String getPassword() {
        return resolvePassword(id, student.getId(), test.getId());
    }

    @SneakyThrows
    public static String resolvePassword(Long examineeId, Long studentId, Long testId) {
        String password = String.format("%d %d %d", examineeId, studentId, testId);
        return DatatypeConverter.printHexBinary(MessageDigest.getInstance("MD5").digest(password.getBytes()));
    }

    @Override
    public String getUsername() {
        return resolveUsername(student.getId(), test.getId());
    }

    public static String resolveUsername(Long studentId, Long testId) {
        return String.format("%d %d", studentId, testId);
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

