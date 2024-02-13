﻿using com.mycompany.app.json_serializer;
using System.Text.Json;

namespace runtime_csharp.json_serializer;

public class AddressTests
{

    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void TestSerializingFullModel()
    {
        Address address = new();
        NestedObject nestedObject = new();
        nestedObject.Test = "test";
        address.NestedObject = nestedObject;
        address.Marriage = true;
        address.Members = 2;
        address.HouseNumber = 1;
        address.ArrayType = new dynamic[] { 1, "test" };
        address.EnumTest = EnumTest.TEST;
        address.HouseType = HousingType.FLAT;
        address.RoofType = TypeOfRoof.STRAW;
        address.AdditionalProperties = new Dictionary<string, dynamic>();
        address.AdditionalProperties.Add("test_not_used", 2);

        string actualJsonString = JsonSerializer.Serialize(address);
        string expectedJsonString = "{\"house_number\":1,\"marriage\":true,\"members\":2,\"array_type\":[1,\"test\"],\"nestedObject\":{\"test\":\"test\"},\"enumTest\":\"test\",\"houseType\":\"flat\",\"roofType\":\"straw\",\"test_not_used\":2}";
        Assert.That(actualJsonString, Is.EqualTo(expectedJsonString));
    }
}

