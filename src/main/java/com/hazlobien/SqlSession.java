/*
 * http://burtsev.net/en/2012/01/13/107/
 */

package com.hazlobien;

import java.io.Closeable;
import java.sql.Connection;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.cursor.Cursor;
import org.apache.ibatis.executor.BatchResult;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;

@SuppressWarnings("unchecked")
public class SqlSession implements org.apache.ibatis.session.SqlSession, Closeable {

	private org.apache.ibatis.session.SqlSession wrappedSession;

	SqlSession(org.apache.ibatis.session.SqlSession wrappedSession) {
		this.wrappedSession = wrappedSession;
	}

	// added by GT
	@Override
	public <T> Cursor<T> selectCursor(String statement) {
		return wrappedSession.selectCursor(statement);
	}

	@Override
	public <T> Cursor<T> selectCursor(String statement, Object object) {
		return wrappedSession.selectCursor(statement, object);
	}

	@Override
	public <T> Cursor<T> selectCursor(String statement, Object object, RowBounds rowBounds) {
		return wrappedSession.selectCursor(statement, object, rowBounds);
	}
	// added

	@Override
	public Object selectOne(String statement) {
		return wrappedSession.selectOne(statement);
	}

	@Override
	public Object selectOne(String statement, Object parameter) {
		return wrappedSession.selectOne(statement, parameter);
	}

	@Override
	public List<?> selectList(String statement) {
		return wrappedSession.selectList(statement);
	}

	@Override
	public List<?> selectList(String statement, Object parameter) {
		return wrappedSession.selectList(statement, parameter);
	}

	@Override
	public List<?> selectList(String statement, Object parameter, RowBounds rowBounds) {
		return wrappedSession.selectList(statement, parameter, rowBounds);
	}

	@Override
	public Map<?, ?> selectMap(String statement, String mapKey) {
		return wrappedSession.selectMap(statement, mapKey);
	}

	@Override
	public Map<?, ?> selectMap(String statement, Object parameter, String mapKey) {
		return wrappedSession.selectMap(statement, parameter, mapKey);
	}

	@Override
	public Map<?, ?> selectMap(String statement, Object parameter, String mapKey, RowBounds rowBounds) {
		return wrappedSession.selectMap(statement, parameter, mapKey, rowBounds);
	}

	@Override
	@SuppressWarnings("rawtypes")
	public void select(String statement, Object parameter, ResultHandler handler) {
		wrappedSession.select(statement, parameter, handler);
	}

	@Override
	@SuppressWarnings("rawtypes")
	public void select(String statement, ResultHandler handler) {
		wrappedSession.select(statement, handler);
	}

	@Override
	@SuppressWarnings("rawtypes")
	public void select(String statement, Object parameter, RowBounds rowBounds, ResultHandler handler) {
		wrappedSession.select(statement, parameter, rowBounds, handler);
	}

	@Override
	public int insert(String statement) {
		return wrappedSession.insert(statement);
	}

	@Override
	public int insert(String statement, Object parameter) {
		return wrappedSession.insert(statement, parameter);
	}

	@Override
	public int update(String statement) {
		return wrappedSession.update(statement);
	}

	@Override
	public int update(String statement, Object parameter) {
		return wrappedSession.update(statement, parameter);
	}

	@Override
	public int delete(String statement) {
		return wrappedSession.delete(statement);
	}

	@Override
	public int delete(String statement, Object parameter) {
		return wrappedSession.delete(statement, parameter);
	}

	@Override
	public void commit() {
		wrappedSession.commit();
	}

	@Override
	public void commit(boolean force) {
		wrappedSession.commit(force);
	}

	@Override
	public void rollback() {
		wrappedSession.rollback();
	}

	@Override
	public void rollback(boolean force) {
		wrappedSession.rollback(force);
	}

	@Override
	public List<BatchResult> flushStatements() {
		return wrappedSession.flushStatements();
	}

	@Override
	public void close() {
		wrappedSession.close();
	}

	@Override
	public void clearCache() {
		wrappedSession.clearCache();
	}

	@Override
	public Configuration getConfiguration() {
		return wrappedSession.getConfiguration();
	}

	@Override
	public <T> T getMapper(Class<T> type) {
		return wrappedSession.getMapper(type);
	}

	@Override
	public Connection getConnection() {
		return wrappedSession.getConnection();
	}

}