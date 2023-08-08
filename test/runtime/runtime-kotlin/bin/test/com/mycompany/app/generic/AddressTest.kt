package com.mycompany.app.generic

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.hamcrest.CoreMatchers.containsString
import org.hamcrest.CoreMatchers.not
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.TestInstance

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class AddressTest {
    private lateinit var address: Address

    @BeforeAll
    fun setup() {
        address = Address(
            streetName = "Test address 2",
            houseNumber = 2,
            marriage = true,
            members = 2,
            arrayType = listOf(2, "test"),
            nestedObject = Address.NestedObject(test = "test")
        )
    }

    @Test
    fun shouldBeAbleToSerializeModel() {
        val objectMapper: ObjectMapper = jacksonObjectMapper()
        val json = objectMapper.writeValueAsString(address)
        assertTrue(json.isNotEmpty())
    }

    @Test
    fun shouldNotContainAdditionalPropertiesWhenSerialized() {
        /**
         * additionalProperties should be unwrapped when serialized
         */
        val objectMapper: ObjectMapper = jacksonObjectMapper()
        val json = objectMapper.writeValueAsString(address)
        assertThat(json, not(containsString("additionalProperties")))
    }
}