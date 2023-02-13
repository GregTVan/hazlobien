package com.hazlobien;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.security.PermitAll;
import javax.servlet.ServletException;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.ibatis.session.SqlSession;

@Path("/frases")
public class FraseService {

	@GET
	@PermitAll
	@Produces(MediaType.APPLICATION_JSON)
	public List<Frase> get() throws ServletException, IOException {
		try (SqlSession session = MyBatisConnectionFactory.getSqlSessionFactory().openSession()) {
			List<Frase> ret = session.selectList("selectFrases");
			return ret;
		}
	}
	
}