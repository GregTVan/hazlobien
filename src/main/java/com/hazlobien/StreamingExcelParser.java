package com.hazlobien;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import com.monitorjbl.xlsx.StreamingReader;


class Parsed {
	String es;
	String[] expect;
}

public class StreamingExcelParser {

	public ArrayList<Frase> parse(byte[] fileContent) throws IOException {
		ArrayList<Frase> ret = new ArrayList<Frase>();
		int rowNum = 0;
		try (InputStream is = new ByteArrayInputStream(fileContent); Workbook workbook = StreamingReader.builder().bufferSize(4096).open(is)) {
			// zero-based
			for (int sheetNum=0;sheetNum < workbook.getNumberOfSheets(); sheetNum++) {
				Sheet sheet = workbook.getSheetAt(sheetNum);
				for (Row row : sheet) {
					if(row.getPhysicalNumberOfCells() < 2) {
						System.out.println(MessageFormat.format("row {0} has insufficient columns, skipped", rowNum));
						continue;
					}
					Frase frase = new Frase();
					frase.en = row.getCell(0).getStringCellValue();
					Parsed parsed = parseEs(row.getCell(1).getStringCellValue());
					frase.es = parsed.es;
					frase.expect = parsed.expect;
					if(row.getPhysicalNumberOfCells() >= 3) {
						frase.categories = parseCategories(row.getCell(2).getStringCellValue());
					}
					ret.add(frase);
					rowNum++;
				}
			}
		}
		return ret;
	}

	private Parsed parseEs(String s) {
		Parsed ret = new Parsed();
		List<String> exp = new ArrayList<String>();
		ret.es = "";
		String expect = "";
		char[] ch = s.toCharArray();
		boolean inExpect = false;
		for(int i=0;i<ch.length;i++) {
			switch (ch[i]) {
			case '(':
				if(inExpect) {
					System.out.println(MessageFormat.format("bracketing error1: {0}", s));
				} else {
					inExpect = true;
					continue;
				}
				break;
			case ')':
				if(inExpect) {
					inExpect = false;
					exp.add(expect);
					ret.es += "()";
					expect = "";
					continue;
				} else {
					System.out.println(MessageFormat.format("bracketing error2: {0}", s));
				}
				break;
			default: 
				if(inExpect) {
					expect += ch[i];
				} else {
					ret.es += ch[i];
				}
			}
		}
		ret.expect = new String[exp.size()];
		ret.expect = exp.toArray(ret.expect);
		return ret;
	}

	private String[] parseCategories(String in) {
		ArrayList<String> cats = new ArrayList<String>();
		String[] tokens = in.split(" ");
		for(String s : tokens) {
			if(s!= null) {
				s = s.trim();
				if(s.length() > 0) {
					cats.add(s);
				}
			}
		}
		String[] ret = new String[cats.size()];
		cats.toArray(ret);
		return ret;
	}
	
}