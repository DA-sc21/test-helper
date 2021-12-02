package kr.ac.ajou.da.testhelper.account.definition;

public enum AccountRole {
    PROFESSOR,
    ASSISTANT,
    MANAGER;

    public String resolveAuthority(){
        return String.format("ROLE_%s", this.name());
    }
}
