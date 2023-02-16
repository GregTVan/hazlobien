package com.hazlobien;

import java.sql.Array;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.TypeHandler;

public class StringArrayTypeHandler implements TypeHandler<String[]> {

    @Override
    public void setParameter(PreparedStatement ps, int i, String[] parameter, JdbcType jdbcType) throws SQLException {
        if (parameter == null) {
            ps.setNull(i, Types.ARRAY);
        } else {
            Array array = ps.getConnection().createArrayOf("text", parameter);
            ps.setArray(i, array);
        }
    }

    @Override
    public String[] getResult(ResultSet rs, String columnName) throws SQLException {
    	Array array = rs.getArray(columnName);
        if(array != null) {
        	return (String[]) array.getArray();
        } else {
        	return new String[0];
        }
    }

    @Override
    public String[] getResult(ResultSet rs, int columnIndex) throws SQLException {
        Array array = rs.getArray(columnIndex);
        if(array != null) {
        	return (String[]) array.getArray();
        } else {
        	return new String[0];
        }
    }

    @Override
    public String[] getResult(CallableStatement cs, int columnIndex) throws SQLException {
        Array array = cs.getArray(columnIndex);
        if(array != null) {
        	return (String[]) array.getArray();
        } else {
        	return new String[0];
        }
    }
}
