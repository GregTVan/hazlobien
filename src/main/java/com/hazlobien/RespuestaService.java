package com.hazlobien;

import java.io.IOException;

import javax.annotation.security.PermitAll;
import javax.servlet.ServletException;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

import org.apache.ibatis.session.SqlSession;

@Path("/respuesta")
public class RespuestaService {
	
	@POST
	public void post(Respuesta respuesta) throws ServletException, IOException {
		try (SqlSession session = MyBatisConnectionFactory.getSqlSessionFactory().openSession()) {
			session.insert("insertRespuesta", respuesta);
			session.commit();
		}
	}
		
}
