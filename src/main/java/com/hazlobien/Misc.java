package com.hazlobien;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class Misc {

	public static void log(String s) {
		DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss.SSSZ");
		Date date = new Date();
		System.out.println(dateFormat.format(date) + " " + s);
	}

	public static boolean noData(String s) {
		return !(hasData(s));
	}

	public static boolean hasData(String s) {
		if (s == null)
			return false;
		if (s.trim().equals(""))
			return false;
		return true;
	}

	public static boolean noData(List list) {
		return !(hasData(list));
	}
	
	public static boolean hasData(List list) {
		if (list == null)
			return false;
		if (list.size() == 0) 
			return false;
		return true;
	}
	
}