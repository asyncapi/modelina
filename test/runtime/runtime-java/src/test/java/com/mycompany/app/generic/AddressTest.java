
package com.mycompany.app.generic;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

import org.junit.Before;
import org.junit.Test;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.*;

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
        assertTrue( json != null );
		assertTrue(json.length() != 0);
    }

    @Test
    public void shouldNotContainAdditionalPropertiesWhenSerialized() throws JsonProcessingException
    {
		/**
		 * additionalProperties should be unwrapped when serialized
		 */
    	ObjectMapper objectMapper = new ObjectMapper();
    	String json = objectMapper.writeValueAsString(address);
        assertTrue( true );
        assertThat( json, not(containsString("additionalProperties")));
    }
}
