package com.mycompany.app.generic

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class AddressSpec extends AnyFlatSpec with Matchers {
  it should "generate model with the right fields" in {
    val address = Address(
      streetName = Some("Test address 2"),
      houseNumber = 2,
      marriage = Some(true),
      members = Some(2),
      arrayType = List(2, "test"),
      nestedObject = Some(NestedObject(Some("test"), None)),
      enumTest = None,
      houseType = None,
      roofType = None,
      requiredDate = java.time.OffsetDateTime.parse("2024-03-10T08:00:00Z"),
      nullableString = None,
      nullableNumber = None,
      nullableDate = None,
      nullableArray = None,
      nullableUnionArray = None,
      nullableTuple = None,
      nullableObject = None,
      nullableDictionary = None,
      requiredRefArray = List.empty[RefObject],
      additionalProperties = None
    )

    address.nestedObject.get.additionalProperties shouldBe None
  }
}
