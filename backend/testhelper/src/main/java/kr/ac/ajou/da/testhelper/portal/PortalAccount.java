package kr.ac.ajou.da.testhelper.portal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

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
	
	public PortalAccount(Long id, String name, String email) {
		this.id = id;
		this.name = name;
		this.email = email;
	}
}
