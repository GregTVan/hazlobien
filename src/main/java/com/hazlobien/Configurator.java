package com.hazlobien;

import javax.ws.rs.ApplicationPath;

import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.server.ResourceConfig;

/*
 * PROBABLY COULD HAVE BEEN DONE IN WEB.XML, think about this
 * https://howtodoinjava.com/jersey/jersey-file-upload-example/
 */

@ApplicationPath("/rest")
public class Configurator extends ResourceConfig {
	public Configurator() {
		//register(AuthorizationFilter.class);
		// Since Tomcat 9.0/Jersey 2.29, this must be loaded explicitly
		// via a javax.ws.rs parameter in web.xml. Otherwise, Jersey WILL
		// work but custom serializers will NOT work, even if they are
		// correctly annotated. Before, the serializer was enough.
		packages("com.hazlobien");
		register(JacksonFeature.class);
		//register(MultiPartFeature.class);
	}
}