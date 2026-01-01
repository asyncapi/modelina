package com.mycompany.app.generic

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.TestInstance

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class AddressTest {
    private lateinit var address: Address

    @BeforeAll
    fun setup() {
        val nestedObj = NestedObject(test = "test")
        address = Address(
            streetName = "Test address 2",
            houseNumber = 2.0,
            marriage = true,
            members = 2,
            arrayType = listOf(2, "test"),
            nestedObject = nestedObj
        )
    }

    @Test
    fun shouldBeAbleToSerializeModel() {
        val objectMapper: ObjectMapper = jacksonObjectMapper()
        val json = objectMapper.writeValueAsString(address)
        assertTrue(json.isNotEmpty())
        assertNotNull(json)
    }
}