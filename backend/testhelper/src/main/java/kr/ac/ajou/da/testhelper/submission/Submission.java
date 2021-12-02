package kr.ac.ajou.da.testhelper.submission;


import kr.ac.ajou.da.testhelper.definition.VerificationStatus;
import kr.ac.ajou.da.testhelper.student.Student;
import kr.ac.ajou.da.testhelper.submission.definition.SubmissionStatus;
import kr.ac.ajou.da.testhelper.test.Test;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Objects;

@Getter
@Setter(AccessLevel.PRIVATE)
@NoArgsConstructor
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
    
    @Column(nullable = false)
    @Enumerated(value = EnumType.STRING)
    private SubmissionStatus submitted;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private VerificationStatus verified = VerificationStatus.PENDING;

    @Column(nullable = false)
    private Long supervisedBy;

    public Submission(Long id, Student student, Test test, Long supervisedBy) {
        this.id = id;
        this.student = student;
        this.test = test;
        this.supervisedBy = supervisedBy;
    }

    public String resolveRoomId(){
        return this.id.toString();
    }

    public void updateVerified(boolean verified) {
        this.setVerified(verified
                ? VerificationStatus.SUCCESS
                : VerificationStatus.REJECTED);
    }

    public void updateConsented(boolean consented){
        this.setConsented(consented);
    }

	public void updateSubmitted(SubmissionStatus submitted) {
		this.setSubmitted(submitted);
	}

    public boolean isSubmitted() {
        return Objects.equals(SubmissionStatus.DONE, submitted);
    }
}
