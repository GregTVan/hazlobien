/*
 * http://burtsev.net/en/2012/01/13/107/
 */

package com.hazlobien;

import java.sql.Connection;

import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.TransactionIsolationLevel;

public class SqlSessionFactory implements org.apache.ibatis.session.SqlSessionFactory {

	private org.apache.ibatis.session.SqlSessionFactory wrappedFactory;

	SqlSessionFactory(org.apache.ibatis.session.SqlSessionFactory wrappedFactory) {
		this.wrappedFactory = wrappedFactory;
	}

	@Override
	public SqlSession openSession() {
		return new SqlSession(wrappedFactory.openSession());
	}

	@Override
	public SqlSession openSession(boolean autoCommit) {
		return new SqlSession(wrappedFactory.openSession(autoCommit));
	}

	@Override
	public SqlSession openSession(Connection connection) {
		return new SqlSession(wrappedFactory.openSession(connection));
	}

	@Override
	public SqlSession openSession(TransactionIsolationLevel level) {
		return new SqlSession(wrappedFactory.openSession(level));
	}

	@Override
	public SqlSession openSession(ExecutorType execType) {
		return new SqlSession(wrappedFactory.openSession(execType));
	}

	@Override
	public SqlSession openSession(ExecutorType execType, boolean autoCommit) {
		return new SqlSession(wrappedFactory.openSession(execType, autoCommit));
	}

	@Override
	public SqlSession openSession(ExecutorType execType, TransactionIsolationLevel level) {
		return new SqlSession(wrappedFactory.openSession(execType, level));
	}

	@Override
	public SqlSession openSession(ExecutorType execType, Connection connection) {
		return new SqlSession(wrappedFactory.openSession(execType, connection));
	}

	@Override
	public Configuration getConfiguration() {
		return wrappedFactory.getConfiguration();
	}

}