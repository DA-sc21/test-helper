package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.course.Course;
import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import kr.ac.ajou.da.testhelper.test.definition.TestType;
import kr.ac.ajou.da.testhelper.test.exception.CannotEndTestBeforeEndTimeException;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
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

    //private String problem;

    @ManyToMany
    @JoinTable(name = "TEST_ASSISTANT",
            joinColumns = @JoinColumn(name="test_id"),
            inverseJoinColumns = @JoinColumn(name="account_id"))
    private Set<Account> assistants = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

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
}
