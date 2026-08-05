package com.mycompany.app.jackson

import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.time.OffsetDateTime

class AddressTest {
    private val objectMapper = jacksonObjectMapper()
        .registerModule(JavaTimeModule())
        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)

    @Test
    fun shouldSerializeAndDeserializeModelUsingSchemaNamesAndEnumValues() {
        val nestedObj = NestedObject(test = "test")
        val address = Address(
            streetName = "Test address 2",
            houseNumber = 2.0,
            marriage = true,
            members = 2,
            arrayType = listOf(2, "test"),
            nestedObject = nestedObj,
            enumTest = EnumTest.TEST,
            requiredDate = OffsetDateTime.parse("2024-03-10T08:00:00Z"),
            requiredRefArray = emptyList(),
            additionalProperties = mutableMapOf("custom_field" to "custom value")
        )

        val json = objectMapper.writeValueAsString(address)
        val expectedJson = """{"street_name":"Test address 2","house_number":2.0,"marriage":true,"members":2,"array_type":[2,"test"],"nestedObject":{"test":"test"},"enumTest":"test","required_date":"2024-03-10T08:00:00Z","required_ref_array":[],"custom_field":"custom value"}"""

        assertEquals(expectedJson, json)
        assertEquals(address, objectMapper.readValue<Address>(json))
    }
}
