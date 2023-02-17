package com.hazlobien;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.apache.ibatis.session.SqlSession;

public class FraseLoader {

	public static void main(String[] args) throws IOException {
		String fileName = "/tmp/hazlobien.xlsx";
		try (InputStream inputStream = new FileInputStream(fileName); SqlSession session = MyBatisConnectionFactory.getSqlSessionFactory().openSession()) {
            long fileSize = new File(fileName).length();
            byte[] fileContent = new byte[(int) fileSize];	 
            inputStream.read(fileContent);
            List<Frase> list = new StreamingExcelParser().parse(fileContent);
            session.delete("deleteAllFrases");
            for(Frase frase : list) {
            	session.insert("insertFrase", frase);
            }
            session.commit();
        } catch (Exception e) {
            e.printStackTrace();
        }
	}	
	
}