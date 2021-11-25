package kr.ac.ajou.da.testhelper.account;

import kr.ac.ajou.da.testhelper.account.exception.AccountNotFoundException;
import kr.ac.ajou.da.testhelper.common.dummy.DummyFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class AccountServiceTest {

    @InjectMocks
    private AccountService accountService;

    @Mock
    private AccountRepository accountRepository;

    @BeforeEach
    void init(){
        accountRepository = mock(AccountRepository.class);
        accountService = new AccountService(accountRepository);
    }

    @Test
    void get_success() {
        //given
        Account expectedAccount = DummyFactory.createAccount();

        when(accountRepository.findById(anyLong())).thenReturn(Optional.of(expectedAccount));

        //when
        Account actualAccount = accountService.get(expectedAccount.getId());

        //then
        assertEquals(expectedAccount, actualAccount);
    }

    @Test
    void get_accountNotFound_thenThrow_AccountNotFoundException() {
        //given
        Long accountId = 1L;

        when(accountRepository.findById(anyLong())).thenReturn(Optional.empty());

        //when
        assertThrows(AccountNotFoundException.class, ()->{
            accountService.get(accountId);
        });

        //then
    }

    @Test
    void getByIds() {
        //given
        List<Account> expectedAccounts = new ArrayList<>();
        expectedAccounts.add(DummyFactory.createAccount());

        when(accountRepository.findAllById(anyList())).thenReturn(expectedAccounts);

        //when
        List<Account> actualAccounts = accountService.getByIds(expectedAccounts.stream()
                .mapToLong(Account::getId).boxed()
                .collect(Collectors.toList()));

        //then
        verify(accountRepository, times(1)).findAllById(anyList());
        assertEquals(expectedAccounts, actualAccounts);
    }
}