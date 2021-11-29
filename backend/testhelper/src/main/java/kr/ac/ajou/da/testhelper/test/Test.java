package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.course.Course;
import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import kr.ac.ajou.da.testhelper.test.definition.TestType;
import kr.ac.ajou.da.testhelper.test.exception.CannotEndTestBeforeEndTimeException;
import kr.ac.ajou.da.testhelper.test.exception.CannotUpdateTestAssistantException;
import kr.ac.ajou.da.testhelper.test.exception.CannotUpdateTestException;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@NoArgsConstructor
@Table(name = "TEST")
@Getter
@Setter(value = AccessLevel.PRIVATE)
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TestType testType;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Column(name = "test_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private TestStatus status = TestStatus.CREATE;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "TEST_ASSISTANT",
            joinColumns = @JoinColumn(name="test_id"),
            inverseJoinColumns = @JoinColumn(name="account_id"))
    private Set<Account> assistants = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private Long createdBy;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Long updatedBy;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Test(Long id,
                TestType testType,
                LocalDateTime startTime,
                LocalDateTime endTime,
                Course course) {
        this.id = id;
        this.testType = testType;
        this.startTime = startTime;
        this.endTime = endTime;
        this.course = course;
    }

    public Test(TestType testType,
                LocalDateTime startTime,
                LocalDateTime endTime,
                Course course,
                Long createdBy) {
        this.testType = testType;
        this.startTime = startTime;
        this.endTime = endTime;
        this.course = course;
        this.createdBy = createdBy;
        this.updatedBy = createdBy;
    }

    public String resolveName() {
        return String.format("%s %s", course.getName(), testType.getName());
    }

    public void updateStatus(TestStatus status) {

        if(isEndingTestBeforeEndTime(status)){
            throw new CannotEndTestBeforeEndTimeException();
        }

        setStatus(status);
    }

    private boolean isEndingTestBeforeEndTime(TestStatus status) {
        return TestStatus.ENDED.equals(status) && LocalDateTime.now().isBefore(endTime);
    }

    public boolean hasProfessor(Account account) {
        return this.getCourse().getProfessor().equals(account);
    }

    public boolean hasAssistant(Account account) {
        return this.getAssistants().contains(account);
    }

    public void updateAssistants(List<Account> assistants) {

        if(!isValidStatusForUpdatingAssistant()){
            throw new CannotUpdateTestAssistantException();
        }

        this.assistants.clear();
        this.assistants.addAll(assistants);
    }

    private boolean isValidStatusForUpdatingAssistant() {
        return Objects.equals(TestStatus.CREATE, status);
    }

    public void update(TestType type, LocalDateTime startTime, LocalDateTime endTime, Long updatedBy) {

        if(!isValidStatusForUpdating()){
            throw new CannotUpdateTestException();
        }

        setTestType(type);
        setStartTime(startTime);
        setEndTime(endTime);
        setUpdatedBy(updatedBy);
    }

    private boolean isValidStatusForUpdating() {
        return List.of(TestStatus.CREATE, TestStatus.INVITED).contains(status);
    }

    public boolean canUpdateAssistant() {
        return isValidStatusForUpdatingAssistant();
    }

    public boolean canSendInvitation() {
        return Objects.equals(TestStatus.CREATE, status);
    }
}
