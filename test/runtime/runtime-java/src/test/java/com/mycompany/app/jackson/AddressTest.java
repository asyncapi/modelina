
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
		// requiredRefArray is a REQUIRED field with no @JsonInclude(NON_NULL); set it so it
		// serializes as an empty array instead of null.
		address.setRequiredRefArray(new RefObject[] {});
		// NOTE: requiredDate (java.time.OffsetDateTime) is intentionally left null. The test
		// ObjectMapper does not register a JavaTimeModule (jackson-datatype-jsr310 is not a
		// dependency), so a non-null OffsetDateTime would serialize as an unpredictable POJO.
		// Left null, it serializes predictably as "required_date":null.
	}

    @Test
    public void shouldBeAbleToSerializeModel() throws JsonProcessingException
    {
    	ObjectMapper objectMapper = new ObjectMapper();
    	String json = objectMapper.writeValueAsString(address);
		String expectedJson = "{\"street_name\":\"Test address 2\",\"house_number\":2.0,\"marriage\":true,\"members\":2,\"array_type\":[2,\"test\"],\"nestedObject\":{\"test\":\"test\"},\"required_date\":null,\"required_ref_array\":[]}";
        assertNotNull(json);
		assertEquals(json, expectedJson);
    }
}
