package com.mycompany.app.generic

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class AddressSpec extends AnyFlatSpec with Matchers {
  "should generate model with the right fields" in {
    val address = Address(
      streetName = "Test address 2",
      houseNumber = 2,
      marriage = true,
      members = 2,
      arrayType = List(2, "test"),
      nestedObject = NestedObject(test = "test")
    )
  }
}
