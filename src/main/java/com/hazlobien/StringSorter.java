package com.hazlobien;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class StringSorter {

	public static List<String> sort(List<String> in) {
		Collections.sort(in, new Comparator<String>() {
		    @Override
		    public int compare(String s1, String s2) {
		    	if(s1.startsWith("The ")) {
		    		s1 = s1.substring(4);
		    	}
		    	if(s2.startsWith("The ")) {
		    		s2 = s2.substring(4);
		    	}
		        return s1.compareToIgnoreCase(s2);
		    }
		});
		return in;
	}
	
}