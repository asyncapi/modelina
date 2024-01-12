
package com.mycompany.app.jackson;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

import org.junit.Before;
import org.junit.Test;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.*;
import com.mycompany.app.jackson.Address;
import com.mycompany.app.jackson.NestedObject;

/**
 * Unit test for Address.
 */
public class AddressTest 
{
	Address address = new Address();
	@Before
	public void before() {
		address.setStreetName("Test address 2");
		address.setHouseNumber(2d);
		address.setMarriage(true);
		address.setMembers(2);
		address.setArrayType(new Object[] {Integer.valueOf(2), "test"});
		NestedObject obj = new NestedObject();
		obj.setTest("test");
		address.setNestedObject(obj);
	}

    @Test
    public void shouldBeAbleToSerializeModel() throws JsonProcessingException
    {
    	ObjectMapper objectMapper = new ObjectMapper();
    	String json = objectMapper.writeValueAsString(address);
		String expectedJson = "{\"street_name\":\"Test address 2\",\"house_number\":2.0,\"marriage\":true,\"members\":2,\"array_type\":[2,\"test\"],\"nestedObject\":{\"test\":\"test\"}}";
        assertNotNull(json);
		assertEquals(json, expectedJson);
    }
}
