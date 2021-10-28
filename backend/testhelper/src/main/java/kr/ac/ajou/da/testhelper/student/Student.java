package kr.ac.ajou.da.testhelper.student;

import lombok.*;

import javax.persistence.*;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter(value = AccessLevel.PRIVATE)
@Entity
@Table(name = "STUDENT")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(name="student_num", nullable = false, length = 30)
    private String studentNumber;

    @Column(nullable = false, length = 50)
    private String email;
}