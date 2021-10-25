package kr.ac.ajou.da.testhelper.submission;


import kr.ac.ajou.da.testhelper.definition.VerificationStatus;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter(AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long studentId;

    @Column(nullable = false)
    private Long testId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private VerificationStatus verified;

    @Column(nullable = false)
    private Long supervisedBy;

    public void updateVerified(boolean verified) {
        this.setVerified(verified
                ? VerificationStatus.SUCCESS
                : VerificationStatus.REJECTED);
    }
}
