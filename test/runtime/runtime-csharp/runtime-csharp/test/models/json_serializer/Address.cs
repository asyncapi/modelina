using com.mycompany.app.json_serializer;
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

    [Test]
    public void TestDeserializingFullModel()
    {
        string jsonString = "{\"house_number\":1,\"marriage\":true,\"members\":2,\"array_type\":[1,\"test\"],\"nestedObject\":{\"test\":\"test\"},\"enumTest\":\"test\",\"houseType\":\"flat\",\"roofType\":\"straw\"}";

        Address address = Address.Deserialize(jsonString);

        Assert.That(address.HouseNumber, Is.EqualTo(1));
        Assert.That(address.Marriage, Is.EqualTo(true));
        Assert.That(address.Members, Is.Not.Null);
        address.Members.TryGetInt32(out int membersValue);
        Assert.That(membersValue, Is.EqualTo(2));
        Assert.That(address.ArrayType.Length, Is.EqualTo(2));
        address.ArrayType[0].TryGetInt32(out int arrayTypeValue0);
        Assert.That(arrayTypeValue0, Is.EqualTo(1));
        Assert.That(address.ArrayType[1].GetString(), Is.EqualTo("test"));
        Assert.That(address.NestedObject, Is.Not.Null);
        Assert.That(address.NestedObject.Test, Is.EqualTo("test"));
        Assert.That(address.EnumTest, Is.EqualTo(EnumTest.TEST));
        Assert.That(address.HouseType, Is.EqualTo(HousingType.FLAT));
        Assert.That(address.RoofType, Is.EqualTo(TypeOfRoof.STRAW));
        Assert.That(address.AdditionalProperties, Is.Null);
    }
}
