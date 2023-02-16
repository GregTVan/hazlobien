package com.hazlobien;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;

import javax.servlet.ServletException;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.ibatis.session.SqlSession;

@Path("/preferences")
public class PreferencesService {
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Preferences get() throws ServletException, IOException {
		String tempId = "temp-user";
		try (SqlSession session = MyBatisConnectionFactory.getSqlSessionFactory().openSession()) {
			return session.selectOne("selectPreferences", tempId);
		}
	}
	
	@POST
	public void post(Preferences preferences) throws ServletException, IOException {
		String tempId = "temp-user";
		try (SqlSession session = MyBatisConnectionFactory.getSqlSessionFactory().openSession()) {
			Preferences dbPreferences = session.selectOne("selectPreferences", tempId);
			if(dbPreferences == null) {
				preferences.userId = tempId;
				session.insert("insertPreferences", preferences);
			} else {
				preferences.userId = tempId;
				session.update("updatePreferences", preferences);
			}
			session.commit();
		}
	}

}