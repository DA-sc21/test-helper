package kr.ac.ajou.da.testhelper.portal.account;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.ac.ajou.da.testhelper.portal.PortalAccount;
import kr.ac.ajou.da.testhelper.portal.account.dto.PostPortalAccountReqDto;
import kr.ac.ajou.da.testhelper.portal.account.exception.PortalAccountNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PortalAccountService {
	@Autowired
	private PortalAccountRepository portalAccountRepository;
	
	public PortalAccount getByEmail(String email) {
		return portalAccountRepository.findByEmail(email)
				.orElseThrow(PortalAccountNotFoundException::new);
	}

	public void createPortalAccount(PostPortalAccountReqDto reqDto) {
		PortalAccount account = new PortalAccount(reqDto.getName(), reqDto.getEmail(), reqDto.getRole());
		portalAccountRepository.save(account);
	}
}
