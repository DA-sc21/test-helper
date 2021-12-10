package kr.ac.ajou.da.testhelper.examinee;

import kr.ac.ajou.da.testhelper.account.Account;
import kr.ac.ajou.da.testhelper.student.Student;
import kr.ac.ajou.da.testhelper.test.Test;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ExamineeService implements UserDetailsService {

    private final ExamineeRepository examineeRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        String[] tokens = username.split(" ");
        Long studentId = Long.parseLong(tokens[0]);
        Long testId = Long.parseLong(tokens[1]);

        Examinee examinee = examineeRepository.findByTestIdAndStudentId(testId, studentId)
                .orElseThrow(() -> new UsernameNotFoundException(username));

        return examinee;
    }

    @Transactional
    public List<Examinee> createTestExaminees(Test test) {
        
        //TODO : batch insert 방법 찾아보기
        List<Student> students = test.getCourse().getStudents();
        List<Account> supervisor = new ArrayList<>(test.getAssistants());
        // supervisor.add(test.getCourse().getProfessor());
        List<Examinee> examinees = new LinkedList<>();

        for(int i = 0; i<students.size(); i++){
            examinees.add(Examinee.create(students.get(i), test, supervisor.get(i% supervisor.size())));
        }

        examineeRepository.saveAll(examinees);

        return examinees;
    }
}
