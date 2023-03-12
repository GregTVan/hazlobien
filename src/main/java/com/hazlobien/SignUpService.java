package com.hazlobien;

import java.io.IOException;

import javax.annotation.security.PermitAll;
import javax.servlet.ServletException;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.ibatis.session.SqlSession;

class SignUpRequest {
	public String email;
	public String password;
}

class SignUpResponse {
	public String message;
	public boolean success;
}

@Path("/signup")
public class SignUpService {

	@POST
	@PermitAll
	@Produces(MediaType.APPLICATION_JSON)
	public SignUpResponse post(SignUpRequest signUpRequest, @Context ContainerRequestContext containerRequestContext) throws ServletException, IOException {
		SignUpResponse ret = new SignUpResponse();
		System.out.println(signUpRequest.email);
		System.out.println(signUpRequest.password);
		Auth0CreateUserReply auth0CreateUserReply = new Auth0Wrapper().createUser(signUpRequest.email, signUpRequest.password);
		// HANDLE DUPE EMAIL, WEAK PASSWORD, INVALID EMAIL
		try (SqlSession session = MyBatisConnectionFactory.getSqlSessionFactory().openSession()) {
			ret.message = auth0CreateUserReply.message;
			ret.success = auth0CreateUserReply.success;
			return ret;
		}
	}

	
}