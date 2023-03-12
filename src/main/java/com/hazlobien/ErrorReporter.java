package com.hazlobien;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ErrorReporter {

	public static void log(String s) {
		DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss.SSSZ");
		Date date = new Date();
		System.out.println(dateFormat.format(date) + " " + s);
	}
	
	public static void report(Exception e) {
		if(e == null) {
			log("Non-Exception error:\n" + getStackTrace());
		} else {
			log(getExceptionInfo(e));
		}
	}
	
	public static String getExceptionInfo(Exception e) {
		return e + "\n" + e.getMessage() + "\n" + getStackTrace(e);
	}
	
	public static String getStackTrace(Exception e) {
		StringWriter sw = new StringWriter();
	    PrintWriter pw = new PrintWriter(sw);
	    e.printStackTrace(pw);
	    return sw.toString();
	}
	
	public static String getStackTrace() {
		String ret = "";
        StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
        for (StackTraceElement element : stackTrace) {
            ret += element.toString() + "\n";
        }
        return ret;
    }
	
}