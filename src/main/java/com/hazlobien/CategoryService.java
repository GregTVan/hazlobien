package com.hazlobien;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.annotation.security.PermitAll;
import javax.servlet.ServletException;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.ibatis.session.SqlSession;

class Category {
	public int count;
	public String tag;
}

@Path("/categories")
public class CategoryService {

	@GET
	@PermitAll
	@Produces(MediaType.APPLICATION_JSON)
	public List<Category> get() throws ServletException, IOException {
		List<Category> ret = new ArrayList<Category>();
		try (SqlSession session = MyBatisConnectionFactory.getSqlSessionFactory().openSession()) {
			List<Frase> frases = session.selectList("selectFrases");
			for(Frase frase : frases) {
				outer:
				for(String s: frase.categories) {
					boolean found = false;
					for(Category c: ret) {
						if(c.tag.equals(s)) {
							c.count++;
							continue outer;
						}
					}
					if(!found) {
						Category category = new Category();
						category.count++;
						category.tag = s;
						ret.add(category);
					}
				}
			}
			Collections.sort(ret, new Comparator<Category>() {
				@Override
				public int compare(Category a, Category b) {
					if (a.tag == null || b.tag == null) {
						return 0;
					}
					if (a.tag.equals(b.tag)) {
						return 0;
					} else {
						return a.tag.compareToIgnoreCase(b.tag);
					}
				}
			});
			return ret;
		}
	}
	
}