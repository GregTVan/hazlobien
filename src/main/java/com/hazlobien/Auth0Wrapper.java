package com.hazlobien;

import java.io.IOException;
import java.text.MessageFormat;
import java.util.ArrayList;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

class Auth0CreateUserReply {
	public boolean success = true;
	public String message;
	public String userId;
}

class Auth0User {
	public String user_id;
	public String email;
}

class Auth0Error {
	public String error;
	public String message;
	public int statusCode;
}

public class Auth0Wrapper {
		
	public Auth0CreateUserReply createUser(String email, String password) throws IOException {
		Auth0CreateUserReply ret = new Auth0CreateUserReply();
		if(!getDoesAuth0HaveThisEmail(email)) {
			return addUserToAuth0(email, password);
		} else {
			ret.message = "Email is already in use!";
			ret.success = false;
		}
		return ret;
	}
	
	public boolean getDoesAuth0HaveThisEmail(String email) {
		try {
			String userId = getAuth0UserIdByEmail(email);
			return Misc.hasData(userId);
		} catch(Exception e) {
			if (e.getMessage().startsWith("multiple Auth0 ID's found for email")) {
				return false;
			} else {
				throw new RuntimeException(MessageFormat.format("Auth0Wrapper: error calling Auth0 for {0}", email));
			}
		}
	}
	
	public String getAuth0UserIdByEmail(String userEmail) throws IOException {
		String resp = sendToAuth0("GET", "?fields=user_id&include_fields=true&q=email:" + "%22" + userEmail + "%22", "");
		Misc.log(resp);
		Gson gson = new GsonBuilder().create();
		ArrayList<Auth0User> list = gson.fromJson(resp, new TypeToken<ArrayList<Auth0User>>() {
		}.getType());
		if (list.size() == 0) {
			return null; // indicates user is not setup, which could be OK
		}
		if (list.size() > 1) {
			throw new RuntimeException("multiple Auth0 ID's found for email: " + userEmail);
		}
		String id = list.get(0).user_id;
		if (id.length() < 5) {
			throw new RuntimeException("auth0 ID malformed: " + id);
		}
		return id;
	}
	
	public Auth0CreateUserReply addUserToAuth0(String userEmail, String password) throws IOException {
		// error looks like this
		// {"statusCode":400,"error":"Bad Request","message":"PasswordStrengthError: Password is too weak"}
		// good looks like this - we only pull out the 2 fields we need, due to the Class definition
		// {"created_at":"2023-03-12T22:11:23.425Z","email":"f@d.com","email_verified":false,"identities":[{"connection":"Username-Password-Authentication","user_id":"640e4e0bbe46449a3725ac1b","provider":"auth0","isSocial":false}],"name":"f@d.com","nickname":"f","picture":"https://s.gravatar.com/avatar/e84879df1fe98a8cb559cf7ee65eb16f?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Ff.png","updated_at":"2023-03-12T22:11:23.425Z","user_id":"auth0|640e4e0bbe46449a3725ac1b"}
		Auth0CreateUserReply ret = new Auth0CreateUserReply();
		String resp = sendToAuth0("POST", "", "{\"connection\": \"Username-Password-Authentication\",\"email\": \"" + userEmail + "\", \"password\": \"" + password + "\"}");
		Gson gson = new GsonBuilder().create();
		Auth0User idrec = gson.fromJson(resp, Auth0User.class);
		if (idrec == null || idrec.user_id == null) {
			Auth0Error auth0Error = gson.fromJson(resp, Auth0Error.class);
			if(auth0Error == null || Misc.noData(auth0Error.message)) {
				throw new RuntimeException(MessageFormat.format("unparseable Auth0 response: {0}",  resp));
			} else {
				ret.message = translateAuth0Message(auth0Error.message);
				ret.success = false;
			}
		} else {
			String id = idrec.user_id;
			if (id.length() > 5) {
				ret.message = "Your user has been created.";
				ret.success = true;
				ret.userId = id;
			} else {
				throw new RuntimeException("auth0 ID malformed: " + id);			
			}
		}
		return ret;
	}
	
	private String translateAuth0Message(String s) {
		if(s.indexOf("didn't pass validation for format email") >= 0) {
			return "Invalid email.";
		}
		if(s.indexOf("Password is too weak") >= 0) {
			return "Password is too weak.";
		}
		return s;
	}

	private String sendToAuth0(String verb, String urlSuffix, String requestBody) throws IOException {
		String tenant = "https://hazlobien.us.auth0.com/api/v2/users";
		String auth0Token = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkFvdmlDaTRnQy1jUEtwa0ZpNlFkdCJ9.eyJpc3MiOiJodHRwczovL2hhemxvYmllbi51cy5hdXRoMC5jb20vIiwic3ViIjoiRzgwRmgzRHBKZWVEVHFMeDZneFlDYWM0UXNWTFplNlZAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vaGF6bG9iaWVuLnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjc4NjU1OTA4LCJleHAiOjE2Nzg3NDIzMDgsImF6cCI6Ikc4MEZoM0RwSmVlRFRxTHg2Z3hZQ2FjNFFzVkxaZTZWIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOmluc2lnaHRzIHJlYWQ6dGVuYW50X3NldHRpbmdzIHVwZGF0ZTp0ZW5hbnRfc2V0dGluZ3MgcmVhZDpsb2dzIHJlYWQ6bG9nc191c2VycyByZWFkOnNoaWVsZHMgY3JlYXRlOnNoaWVsZHMgdXBkYXRlOnNoaWVsZHMgZGVsZXRlOnNoaWVsZHMgcmVhZDphbm9tYWx5X2Jsb2NrcyBkZWxldGU6YW5vbWFseV9ibG9ja3MgdXBkYXRlOnRyaWdnZXJzIHJlYWQ6dHJpZ2dlcnMgcmVhZDpncmFudHMgZGVsZXRlOmdyYW50cyByZWFkOmd1YXJkaWFuX2ZhY3RvcnMgdXBkYXRlOmd1YXJkaWFuX2ZhY3RvcnMgcmVhZDpndWFyZGlhbl9lbnJvbGxtZW50cyBkZWxldGU6Z3VhcmRpYW5fZW5yb2xsbWVudHMgY3JlYXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRfdGlja2V0cyByZWFkOnVzZXJfaWRwX3Rva2VucyBjcmVhdGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiBkZWxldGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiByZWFkOmN1c3RvbV9kb21haW5zIGRlbGV0ZTpjdXN0b21fZG9tYWlucyBjcmVhdGU6Y3VzdG9tX2RvbWFpbnMgdXBkYXRlOmN1c3RvbV9kb21haW5zIHJlYWQ6ZW1haWxfdGVtcGxhdGVzIGNyZWF0ZTplbWFpbF90ZW1wbGF0ZXMgdXBkYXRlOmVtYWlsX3RlbXBsYXRlcyByZWFkOm1mYV9wb2xpY2llcyB1cGRhdGU6bWZhX3BvbGljaWVzIHJlYWQ6cm9sZXMgY3JlYXRlOnJvbGVzIGRlbGV0ZTpyb2xlcyB1cGRhdGU6cm9sZXMgcmVhZDpwcm9tcHRzIHVwZGF0ZTpwcm9tcHRzIHJlYWQ6YnJhbmRpbmcgdXBkYXRlOmJyYW5kaW5nIGRlbGV0ZTpicmFuZGluZyByZWFkOmxvZ19zdHJlYW1zIGNyZWF0ZTpsb2dfc3RyZWFtcyBkZWxldGU6bG9nX3N0cmVhbXMgdXBkYXRlOmxvZ19zdHJlYW1zIGNyZWF0ZTpzaWduaW5nX2tleXMgcmVhZDpzaWduaW5nX2tleXMgdXBkYXRlOnNpZ25pbmdfa2V5cyByZWFkOmxpbWl0cyB1cGRhdGU6bGltaXRzIGNyZWF0ZTpyb2xlX21lbWJlcnMgcmVhZDpyb2xlX21lbWJlcnMgZGVsZXRlOnJvbGVfbWVtYmVycyByZWFkOmVudGl0bGVtZW50cyByZWFkOmF0dGFja19wcm90ZWN0aW9uIHVwZGF0ZTphdHRhY2tfcHJvdGVjdGlvbiByZWFkOm9yZ2FuaXphdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIGNyZWF0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgcmVhZDpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBkZWxldGU6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBjcmVhdGU6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIHJlYWQ6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25faW52aXRhdGlvbnMgcmVhZDpvcmdhbml6YXRpb25zX3N1bW1hcnkgY3JlYXRlOmFjdGlvbnNfbG9nX3Nlc3Npb25zIGNyZWF0ZTphdXRoZW50aWNhdGlvbl9tZXRob2RzIHJlYWQ6YXV0aGVudGljYXRpb25fbWV0aG9kcyB1cGRhdGU6YXV0aGVudGljYXRpb25fbWV0aG9kcyBkZWxldGU6YXV0aGVudGljYXRpb25fbWV0aG9kcyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.pMaFBJQWe_8ntgWdJwKqtU0fP9aVse2cKVWEXRokieD-zVB-sLmxYYjqxNgzsj8LUhZWyLTahWXkhtQlnfEsIEdUXJgqptc5sbkjtrAfKKBVh7wcBXSDRgerBwyzSPtaSr4WZ3Z_i5zgYiO5vKSjsp_Oknqn1oOPn45x8U_fqdB0Bod1s0FaNK1xctszjhZsneSrvnZHFZEKwpcLDmRaxXi32s7BfHn1Ip0Ju0OjGo-kktuQGWJbqsHM8LafiWfkRy6khawmivlFMTlCTfOuJ2FcisWBqE6gzC_gX7JF8slhXw9P-nWQwqLE7DVbxrQpdiyzL3dRDOgk1sDpRBs6Yg";
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			ResponseHandler<String> responseHandler = new ResponseHandler<String>() {
				@Override
				public String handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
					HttpEntity entity = response.getEntity();
					return entity != null ? EntityUtils.toString(entity) : null;
				}
			};
			HttpRequestBase httpRequestBase;
			if (verb.equals("GET")) {
				httpRequestBase = new HttpGet(tenant + urlSuffix);
			} else if (verb.equals("DELETE")) {
				httpRequestBase = new HttpDelete(tenant + urlSuffix);
			} else if (verb.equals("PATCH")) {
				httpRequestBase = new HttpPatch(tenant + urlSuffix);
				StringEntity str = new StringEntity(requestBody);
				str.setContentType("application/json");
				((HttpPatch) httpRequestBase).setEntity(str);
			} else {
				httpRequestBase = new HttpPost(tenant);
				StringEntity str = new StringEntity(requestBody);
				str.setContentType("application/json");
				((HttpPost) httpRequestBase).setEntity(str);
			}
			httpRequestBase.setHeader("Authorization", auth0Token);
			return httpclient.execute(httpRequestBase, responseHandler);
		} finally {
			httpclient.close();
		}
	}
	
	public static void main(String[] args) throws IOException {
		Auth0Wrapper auth0Wrapper = new Auth0Wrapper();
		Misc.log(auth0Wrapper.getAuth0UserIdByEmail("tomkins.greg@gmail.com"));
		Auth0CreateUserReply auth0CreateUserReply = auth0Wrapper.createUser("tonai@tonidiazforever.com", "tonitoni999!");
		Misc.log(auth0CreateUserReply.message);
		Misc.log(auth0CreateUserReply.success + "");
		Misc.log(auth0CreateUserReply.userId);
	}

}