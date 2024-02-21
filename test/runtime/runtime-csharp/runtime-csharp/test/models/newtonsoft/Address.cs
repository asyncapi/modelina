﻿using System.Text.Json;
using com.mycompany.app.newtonsoft;
using Newtonsoft.Json;

namespace runtime_csharp.newtonsoft;

public class AddressTests
{

    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void TestSerializingFullModel()
    {
        Address address = new Address();
        NestedObject nestedObject = new NestedObject();
        nestedObject.Test = "test";
        address.NestedObject = nestedObject;
        address.Marriage = true;
        address.Members = 2;
        address.HouseNumber = 1;
        address.ArrayType = new dynamic[] { 1, "test" };
        address.EnumTest = EnumTest.TEST;
        address.AdditionalProperties = new Dictionary<string, dynamic>();
        address.AdditionalProperties.Add("test_not_used", 2);

        string actualJsonString = JsonConvert.SerializeObject(address);
        string expectedJsonString = "{\"house_number\":1.0,\"marriage\":true,\"members\":2,\"array_type\":[1,\"test\"],\"nestedObject\":{\"test\":\"test\"},\"enumTest\":\"test\",\"test_not_used\":2}";
        Assert.That(actualJsonString, Is.EqualTo(expectedJsonString));
    }
}

