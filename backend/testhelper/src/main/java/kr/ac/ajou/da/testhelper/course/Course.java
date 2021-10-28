package kr.ac.ajou.da.testhelper.course;

import kr.ac.ajou.da.testhelper.test.Test;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@Table(name = "COURSE")
@Getter
@Setter(value = AccessLevel.PRIVATE)
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    //private Account professor;

    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY)
    private List<Test> tests = new ArrayList<>();

    public Course(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}

