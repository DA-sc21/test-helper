package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.course.Course;
import kr.ac.ajou.da.testhelper.submission.Submission;
import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import kr.ac.ajou.da.testhelper.test.definition.TestType;
import kr.ac.ajou.da.testhelper.test.exception.CannotEndTestBeforeEndTimeException;
import kr.ac.ajou.da.testhelper.test.exception.CannotUpdateTestAssistantException;
import kr.ac.ajou.da.testhelper.test.exception.CannotUpdateTestException;
import kr.ac.ajou.da.testhelper.test.result.TestResult;
import kr.ac.ajou.da.testhelper.test.result.exception.CannotResolveTestResultWhenSubmissionsMarkIncompleteException;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@NoArgsConstructor
@Table(name = "TEST")
@Getter
@Setter
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

    @OneToMany(mappedBy = "test", fetch = FetchType.LAZY)
    private List<Submission> submissions = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "TEST_ASSISTANT",
            joinColumns = @JoinColumn(name = "test_id"),
            inverseJoinColumns = @JoinColumn(name = "account_id"))
    private Set<Account> assistants = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "result_id")
    private TestResult result;

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
                TestStatus status,
                Course course) {
        this.id = id;
        this.testType = testType;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
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

        if (isEndingTestBeforeEndTime(status)) {
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

        if (!isValidStatusForUpdatingAssistant()) {
            throw new CannotUpdateTestAssistantException();
        }

        this.assistants.clear();
        this.assistants.addAll(assistants);
    }

    private boolean isValidStatusForUpdatingAssistant() {
        return Objects.equals(TestStatus.CREATE, status);
    }

    public void update(TestType type, LocalDateTime startTime, LocalDateTime endTime, Long updatedBy) {

        if (!isValidStatusForUpdating()) {
            throw new CannotUpdateTestException();
        }

        setTestType(type);
        setStartTime(startTime);
        setEndTime(endTime);
        setUpdatedBy(updatedBy);
    }

    private boolean isValidStatusForUpdating() {
        return Arrays.asList(TestStatus.CREATE, TestStatus.INVITED).contains(status);
    }

    public boolean canUpdateAssistant() {
        return isValidStatusForUpdatingAssistant();
    }

    public boolean canSendInvitation() {
        return Objects.equals(TestStatus.CREATE, status);
    }

    public boolean canStartTest() {
        return Arrays.asList(TestStatus.INVITED, TestStatus.IN_PROGRESS).contains(status)
                && LocalDateTime.now().isAfter(startTime.minusHours(2L));
    }

    public boolean isInProgress() {
        return Objects.equals(TestStatus.IN_PROGRESS, status);
    }

    public void resolveResult() {

        if (!isSubmissionsAllMarked()) {
            throw new CannotResolveTestResultWhenSubmissionsMarkIncompleteException();
        }

        if (Objects.isNull(this.result)) {
            this.setResult(new TestResult());
        }

        this.result.update(this.getSubmissions());

        setStatus(TestStatus.MARK);
    }

    private boolean isSubmissionsAllMarked() {
        return this.getSubmissions().stream().allMatch(Submission::isMarked);
    }

    public boolean isMarked() {
        return Objects.equals(TestStatus.MARK, this.status);
    }

    public boolean isGraded() {
        return Objects.equals(TestStatus.GRADED, this.status);
    }

    public boolean doesResultExist() {
        return Arrays.asList(TestStatus.MARK, TestStatus.GRADED).contains(this.status)
                && !Objects.isNull(this.result);
    }
}
