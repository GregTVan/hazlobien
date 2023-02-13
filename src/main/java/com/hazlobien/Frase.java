package com.hazlobien;

import java.util.ArrayList;

public class Frase {
	
	public String[] categories;
	public String en;
	public String es;
	public String[] expect;
	public long id;
	
	public Frase() {
		//categories = new ArrayList<String>();
		//expect = new ArrayList<String>();
	}
	
	public String[] getCategories() {
		return categories;
	}
	public void setCategories(String[] categories) {
		this.categories = categories;
	}
	public String getEn() {
		return en;
	}
	public void setEn(String en) {
		this.en = en;
	}
	public String getEs() {
		return es;
	}
	public void setEs(String es) {
		this.es = es;
	}
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String[] getExpect() {
		return expect;
	}
	public void setExpect(String[] expect) {
		this.expect = expect;
	}
}
