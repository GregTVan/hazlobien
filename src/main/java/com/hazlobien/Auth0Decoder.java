package com.hazlobien;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.security.PublicKey;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.List;
import java.util.Map;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.MultivaluedMap;

import com.auth0.jwt.JWTVerifier;

public class Auth0Decoder {

	static final JWTVerifier jwtVerifier;

	static {
		InputStream inputStream;
		// from https://manage.auth0.com/dashboard/us/hazlobien/tenant/signing_keys, find 'currently used'
		// entry, click menu to open this. also available from https://hazlobien.us.auth0.com/.well-known/jwks.json,
		// it is the FIRST key (the other one is for future rotation, the 'x5c' parameter.
		StringBuffer auth0PublicKey = new StringBuffer("-----BEGIN CERTIFICATE-----\n" +
				"MIIDBzCCAe+gAwIBAgIJRxWXqqiC5OonMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV" +
				"BAMTFmhhemxvYmllbi51cy5hdXRoMC5jb20wHhcNMjMwMjI1MjIwOTAxWhcNMzYx" +
				"MTAzMjIwOTAxWjAhMR8wHQYDVQQDExZoYXpsb2JpZW4udXMuYXV0aDAuY29tMIIB" +
				"IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvMz3Nb3K30GzmySbIilz8cW9" +
				"ioWSQh6keyNF6VW8cldic16BxgixWE2sT06z9Yp4m58ProFUY8LDhrJgTWTgSCyh" +
				"x5u8hiGSfzno0JYb+c5HbJX94Qqq71dMsKz7aM0QDu+wuY6HzF5W6el1mNOhsjkV" +
				"sh3C5isZ23JV9HrJoKS+D38KdRWvVcE847ujSJbJdxGRE4uh/lL2xv+uJGZ6gAe2" +
				"QRWxAs42eeNmR5wPgY74Oh4MdcTvptkQ2RYEO5xciHOYKv1uUWi1PC0lL/JHqTX1" +
				"tsCL6NOzkzOiN/zYGmw9vf4OK1E4BL/YxRJCtWfOulnwPfXogAGa3cWzM4RrBwID" +
				"AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBR9b6K22PJGNsJDwl4J" +
				"WmUWWLNNOjAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAIFzO4Ry" +
				"ZPjemH1zyMqJNDKsvZDEd/Q7147cKhzt16ZAH0Y5Kvdt2fbp3igWLsOIkWjuvVjm" +
				"D5S+FS9WSP6TbQhGB0yhq7keYqxwnhxFK4hN99lEWtElM8wkwG90HiHvinyFYUis" +
				"QpEMxryLP0jQZFP+y6NJGOzkCwO+zKH0hmMemT+tzcJC1tC1Ed/jhIi/8sTHEKlX" +
				"gW2nP0IGhVROnN5UYUvRP0e/1aLwZokbyME0SI2wqS7YbvN/YpMpp+/bmlCtuGoa" +
				"GmlrALe9d5tHf0zUyvYoRuNgtTbnDYRFOviBLTcGXTuTMoD2sw0eTYz1+kFwsF/7" +
				"MT54JEV6cU5tk+8=" +
				"-----END CERTIFICATE-----");
		try {
			inputStream = new ByteArrayInputStream(String.valueOf(auth0PublicKey).getBytes("UTF-8"));
			CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
			X509Certificate certificate = (X509Certificate) certificateFactory.generateCertificate(inputStream);
			PublicKey publicKey = certificate.getPublicKey();
			jwtVerifier = new JWTVerifier(publicKey);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
	
	public String getUserId(ContainerRequestContext containerRequestContext) {
		return getUserId(getAuthorizationToken (containerRequestContext));
	}
	
	private String getAuthorizationToken(ContainerRequestContext crc) {
		final MultivaluedMap<String, String> headers = crc.getHeaders();
		final List<String> authorizationHeaders = headers.get("Authorization");
		if (authorizationHeaders != null && authorizationHeaders.size() == 1) {
			return authorizationHeaders.get(0);
		} else {
			return null;
		}
	}
	
	private static String getUserId(String accessToken) {
		try {
			final Map<String, Object> claims = jwtVerifier.verify(accessToken);
			String userId = claims.get(("sub")).toString();
			return userId;
		} catch (Exception e) {
			throw new RuntimeException(e.getMessage());
		}
	}  

}


/*
 
 https://204.13.49.88/frases.html
 #access_token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9oYXpsb2JpZW4udXMuYXV0aDAuY29tLyJ9..naHC3pBWH-FgxYgK.wDkcp8t1LqML4hnj6DiLtmHOWOaTlCHBIja5tvtsAqnD7GBsJ2I51ESNDQ57SfRpyN00RcR0LDTOHV-d__Zg5b-oh4-VaMpTYpGArG7iBs1iONTyxLo_2WRXMKAmODFBXARRFAOExRYxWTbLYIQvYSqT5OEAkOWoUWaCQHZQQV9X-Z1Mxlm0cMzOAxlZVqNrCZqIace1zRugAaMw-LB9_tSn_B0il6O3_u7RaNs9q9fMTbKWwjHA-nTdxLth8heMGS2EsIOkTpSDypJZ_kPrrEpJ_pOQ_uXqJL7AO8tu.wkiVe6CXxxMT9FpKPqqGhQ
 &scope=openid
 &expires_in=7200
 &token_type=Bearer
 &state=0XcA2z9l9FGuYz2J-wbUhk5RXla2GlKK
 &id_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkFvdmlDaTRnQy1jUEtwa0ZpNlFkdCJ9.eyJpc3MiOiJodHRwczovL2hhemxvYmllbi51cy5hdXRoMC5jb20vIiwiYXVkIjoiZGtiZXhJcjJ2cHdVY01nRXV1SGhjcm1xZEMyeGkya1giLCJpYXQiOjE2Nzc0Njc3MTksImV4cCI6MTY3NzUwMzcxOSwic3ViIjoiYXV0aDB8NjNmYTg3NWEzOGIxZjcwNmE1MGNiNjkzIiwiYXRfaGFzaCI6IlIwbVc1TmNRYUhyVjgzWUhOaXVQQXciLCJzaWQiOiJERkVQQWN0M2YyOFZpZHNhekZGWVJmN1YyVzF3VHI5bSIsIm5vbmNlIjoicGxuLlM5flh0dm9HbnpoRXpLbl9NLUlJZ3BEb3lBWmgifQ.bG0asqWEof9Mig2T1J7IVxKvSnwZZtTvHFxKb9cYLWEuFJrQc-wkXR7HHZFUH7fm2Maf_Qsmk1xykyb4mFsct9rGfCEPKKIajTHYr0EQpIzUfHpzxrhaoOJgxZBJWLGg6UxoqriRbAZQdEZYkLlJfpS5ci8NiHN3BL87TXthK-5qEdOMVosQltRVaLdNe23gnTrPsDyhn3zijOcm1k3IZ1QzJTQgIKBa-scweMet3rRqba4v0dbTDvyMB4U60eAA_5DUXY-5J_kAiB2l8OIbMP8zEP6A301P-JxPvUWVYRfm9qDP9C-0Eda89qnJPafIa2qUUvjUrALquZgVBEACVQ 
  
  
 
 */