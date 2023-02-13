package com.hazlobien;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

import org.apache.ibatis.session.SqlSession;

class Update {
	public boolean selected;
	public String tag;
}

@Path("/preferences")
public class PreferencesService {
	
	@POST
	public post(Update update) throws ServletException, IOException {
		try (SqlSession session = MyBatisConnectionFactory.getSqlSessionFactory().openSession()) {
			Preferences preferences = new Preferences();
			preferences.categories = new String[]{"added", "by", "java"};
			session.insert("insertPreferences", preferences);
			session.commit();
		}
	}

}
