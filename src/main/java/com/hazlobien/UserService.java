package com.hazlobien;

import java.io.IOException;
import java.text.MessageFormat;
import java.util.UUID;

import javax.annotation.security.PermitAll;
import javax.servlet.ServletException;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.ibatis.session.SqlSession;

class LoginRequest {
	public String email;
	public String password;
}

class Session {
	public long userId;
	public String sessionId;
}

@Path("/auth")
public class UserService {
	
	@POST
	@PermitAll
	@Produces(MediaType.APPLICATION_JSON)
	public Session post(LoginRequest loginRequest, @Context ContainerRequestContext containerRequestContext) throws ServletException, IOException {
		try (SqlSession sqlSession = MyBatisConnectionFactory.getSqlSessionFactory().openSession()) {
			User user = sqlSession.selectOne("selectUser", loginRequest.email);
			if(user != null && user.password.equals(loginRequest.password)) {				
				Session session = new Session();
				session.sessionId = UUID.randomUUID().toString();
				session.userId = user.id;
				sqlSession.insert("insertSession", session);
				return session;
			} else {
				ErrorReporter.report(null);
			}
		} catch(Exception e) {
			ErrorReporter.report(e);
		}
		return null;
	}
	
	public long getUserIdFromSessionId(String sessionId) {
		try (SqlSession sqlSession = MyBatisConnectionFactory.getSqlSessionFactory().openSession()) {
			Session session = sqlSession.selectOne("selectSession", sessionId);
			if(session != null && session.userId >= 0) {
				return session.userId;
			} else {
				ErrorReporter.report(null);
			}
		} catch(Exception e) {
			ErrorReporter.report(e);
		}
		return -1;
	}
	
}