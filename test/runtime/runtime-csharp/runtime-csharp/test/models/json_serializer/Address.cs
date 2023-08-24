using System.Text.Json;
using com.mycompany.app.generic;

namespace runtime_csharp;

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
        address.StreetName = "test";
        address.Marriage = true;
        address.Members = 2;
        address.HouseNumber = 1;
        address.ArrayType = new dynamic[] { 1, "test" };
        string actualJsonString = JsonSerializer.Serialize(address);
        string expectedJsonString = "{\"street_name\":\"test\",\"house_number\":1,\"marriage\":true,\"members\":2,\"array_type\":[1,\"test\"],\"nestedObject\":{\"test\":\"test\"}}";
        Assert.That(actualJsonString, Is.EqualTo(expectedJsonString));
    }
}

