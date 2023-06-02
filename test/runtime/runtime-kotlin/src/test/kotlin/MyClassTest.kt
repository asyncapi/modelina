package com.mycompany.app

import org.junit.Test
import kotlin.test.assertEquals

class MyClassTest {
    @Test
    fun testPrintMessage() {
        val myClass = MyClass()
        val name = "John"
        val expectedMessage = "Hello, $name"
        myClass.printMessage(name)
        assertEquals(expectedMessage, myClass.message)
    }
}
