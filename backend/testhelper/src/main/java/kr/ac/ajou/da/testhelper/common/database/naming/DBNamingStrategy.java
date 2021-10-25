package kr.ac.ajou.da.testhelper.common.database.naming;

import org.hibernate.boot.model.naming.Identifier;
import org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl;
import org.hibernate.engine.jdbc.env.spi.JdbcEnvironment;

public class DBNamingStrategy extends PhysicalNamingStrategyStandardImpl {
    @Override
    public Identifier toPhysicalTableName(Identifier name, JdbcEnvironment context) {

        String tableName = name.getText().toUpperCase();

        return Identifier.toIdentifier(tableName);
    }

    @Override
    public Identifier toPhysicalColumnName(Identifier name, JdbcEnvironment context) {
        String columnName = camelToSnake(name.getText());

        return Identifier.toIdentifier(columnName);
    }

    public static String camelToSnake(String str){
        String regex = "([a-z])([A-Z]+)";
        String replacement = "$1_$2";

        str = str.replaceAll(regex, replacement)
                .toLowerCase();

        return str;
    }
}
