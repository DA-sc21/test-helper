package kr.ac.ajou.da.testhelper.portal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import kr.ac.ajou.da.testhelper.account.definition.AccountRole;
import kr.ac.ajou.da.testhelper.definition.PortalStatus;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter(AccessLevel.PRIVATE)
@Table(name = "PORTAL_ACCOUNT")
@NoArgsConstructor
@Entity
public class PortalAccount {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	@Column(nullable = false)
	private String name;
	
	@Column(nullable = false)
	private String email;
	
	@Enumerated(EnumType.STRING)
    private AccountRole role;
	
	@Column(nullable = false)
    @Enumerated(EnumType.STRING)
	private PortalStatus joined = PortalStatus.PENDING;
	
	public PortalAccount(String name, String email) {
		this.name = name;
		this.email = email;
	}
	
	public PortalAccount(String name, String email, AccountRole role) {
		this.name = name;
		this.email = email;
		this.role = role;
	}
	
	public PortalAccount(Long id, String name, String email, PortalStatus joined) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.joined = joined;
	}
	
	public void updateJoined(PortalStatus joined){
        this.setJoined(joined);
    }

}
