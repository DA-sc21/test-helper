package kr.ac.ajou.da.testhelper.examinee;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

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

}
