package kr.ac.ajou.da.testhelper.portal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter(AccessLevel.PRIVATE)
@Table(name = "PORTAL_ASSISTANT")
@NoArgsConstructor
@Entity
public class PortalAssistant {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	@Column(nullable = false)
	private Long courseId;
	
	@ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private PortalAccount assistant;
}
