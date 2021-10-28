package kr.ac.ajou.da.testhelper.test;

import kr.ac.ajou.da.testhelper.course.Course;
import kr.ac.ajou.da.testhelper.test.definition.TestStatus;
import kr.ac.ajou.da.testhelper.test.definition.TestType;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

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

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TestStatus testStatus = TestStatus.CREATE;

    //private String problem;

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
}
