package kr.ac.ajou.da.testhelper.submission;


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

}
