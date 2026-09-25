package com.mycompany.app.polymorphism

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertInstanceOf
import org.junit.jupiter.api.Test

class PolymorphismTest {
    private val objectMapper = jacksonObjectMapper()

    data class AnimalEnvelope(val animal: Animals)

    @Test
    fun shouldDeserializeDiscriminatorMappingIntoConcreteType() {
        val pet = objectMapper.readValue<Pet>("""{"kind":"dog","bark":true}""")

        assertInstanceOf(Dog::class.java, pet)
        assertEquals("dog", pet.kind)
        assertEquals(true, (pet as Dog).bark)
    }

    @Test
    fun shouldSerializeConcreteTypeThroughParentInterface() {
        val pet: Pet = Cat(lives = 9, kind = "cat")

        assertEquals(
            """{"kind":"cat","lives":9}""",
            objectMapper.writeValueAsString(pet)
        )
    }

    @Test
    fun shouldRoundTripThroughSealedUnionType() {
        val animal: Animals = Dog(bark = true, kind = "dog")

        val json = objectMapper.writerFor(Animals::class.java).writeValueAsString(animal)
        val deserialized = objectMapper.readValue<Animals>(json)

        assertEquals("""{"kind":"dog","bark":true}""", json)
        assertInstanceOf(Dog::class.java, deserialized)
    }

    @Test
    fun shouldRoundTripFieldTypedAsSealedUnion() {
        val envelope = AnimalEnvelope(Cat(lives = 9, kind = "cat"))

        val json = objectMapper.writeValueAsString(envelope)
        val deserialized = objectMapper.readValue<AnimalEnvelope>(json)

        assertEquals("""{"animal":{"kind":"cat","lives":9}}""", json)
        assertInstanceOf(Cat::class.java, deserialized.animal)
    }
}
