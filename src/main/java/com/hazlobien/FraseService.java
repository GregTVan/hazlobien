package com.hazlobien;

import java.io.IOException;
import java.text.MessageFormat;
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
			ret = filterPhrases(ret);
			return ret;
		}
	}
	
	private List<Frase> filterPhrases(List<Frase> in) {
		String tempId = "temp-user";
		try (SqlSession session = MyBatisConnectionFactory.getSqlSessionFactory().openSession()) {
			Preferences preferences = session.selectOne("selectPreferences", tempId);
			if(preferences.mode.equals("ALL")) {
				return in;
			}
			List<Frase> ret = new ArrayList<Frase>();
			if(preferences.mode.equals("CATEGORIES")) {
				for(Frase frase : in) {
					for(String s0: frase.categories) { 
						for(String s1 : preferences.categories) {
							if(s0.equalsIgnoreCase(s1)) {
								ret.add(frase);
							}
						}
					}
				}
				return ret;
			}
			if(preferences.mode.equals("WORDS")) {
				return ret;
			}
			if(ret.size() == 0) {
				System.out.println(MessageFormat.format("User {0} has no selectable phrases, return ALL", tempId));
				ret = in;
			}
			return ret;
		}
	}
	
}