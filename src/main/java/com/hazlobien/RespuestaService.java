package com.hazlobien;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;

import org.apache.ibatis.session.SqlSession;

@Path("/respuesta")
public class RespuestaService {
	
	@POST
	public void post(Respuesta respuesta, @Context ContainerRequestContext containerRequestContext) throws ServletException, IOException {
		respuesta.userId = new Auth0Decoder().getUserId(containerRequestContext);
		try (SqlSession session = MyBatisConnectionFactory.getSqlSessionFactory().openSession()) {
			session.insert("insertRespuesta", respuesta);
			session.commit();
		}
	}
		
}
