package kr.ac.ajou.da.testhelper.submission;


import kr.ac.ajou.da.testhelper.definition.VerificationStatus;
import kr.ac.ajou.da.testhelper.student.Student;
import kr.ac.ajou.da.testhelper.submission.answer.SubmissionAnswer;
import kr.ac.ajou.da.testhelper.submission.definition.SubmissionStatus;
import kr.ac.ajou.da.testhelper.submission.exception.CannotSubmitWhenTestNotInProgressException;
import kr.ac.ajou.da.testhelper.test.Test;
import lombok.*;

import javax.persistence.*;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Getter
@Setter(AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Submission {
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
    private Boolean consented = false;

    @Column(name = "submitted", nullable = false)
    @Enumerated(value = EnumType.STRING)
    private SubmissionStatus status;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private VerificationStatus verified = VerificationStatus.PENDING;

    @Column(nullable = false)
    private Long supervisedBy;

    private Integer score;

    @OneToMany(mappedBy = "submission", fetch = FetchType.LAZY)
    private List<SubmissionAnswer> answers;

    public Submission(Long id, Student student, Test test, Long supervisedBy) {
        this.id = id;
        this.student = student;
        this.test = test;
        this.supervisedBy = supervisedBy;
    }

    public String resolveRoomId() {
        return this.id.toString();
    }

    public void updateVerified(boolean verified) {
        this.setVerified(verified
                ? VerificationStatus.SUCCESS
                : VerificationStatus.REJECTED);
    }

    public void updateConsented(boolean consented) {
        this.setConsented(consented);
    }

    public void updateStatus(SubmissionStatus submitted) {

        if (SubmissionStatus.DONE.equals(submitted)) {
            if (!this.getTest().isInProgress()) {
                throw new CannotSubmitWhenTestNotInProgressException();
            }
        }

        this.setStatus(submitted);
    }

    public boolean isSubmitted() {
        return Arrays.asList(SubmissionStatus.DONE, SubmissionStatus.MARKED).contains(status);
    }

    public void updateScore(int score) {
        this.setScore(score);
    }

    public boolean isMarked() {
        return Objects.equals(SubmissionStatus.MARKED, status);
    }
}
