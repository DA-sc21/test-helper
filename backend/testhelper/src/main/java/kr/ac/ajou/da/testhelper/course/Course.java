package kr.ac.ajou.da.testhelper.course;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.test.Test;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id", nullable = false)
    private Account professor;

    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY)
    private List<Test> tests = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "COURSE_ASSISTANT",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "account_id")
    )
    private Set<Account> assistants = new HashSet<>();

    public Course(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public void updateAssistants(List<Account> assistants) {
        //TODO : batch delete하는 방법 찾아보기

        Set<Account> filteredAssistants = assistants.stream().filter(Account::isAssistant).collect(Collectors.toSet());

        this.assistants.clear();
        this.assistants.addAll(filteredAssistants);
    }
}