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
        TestObject address = new();
        ObjectType nestedObject = new();
        nestedObject.Test = "test";
        address.ObjectType = nestedObject;
        address.BooleanType = true;
        address.NumberType = 1;
        address.ArrayType = new dynamic[] { 1, "test" };
        address.EnumType = EnumType.CURLYLEFT_QUOTATION_TEST_QUOTATION_COLON_2_CURLYRIGHT;
        address.ArrayTypeSimple = new string[] { "test", "test2" };
        address.DictionaryType = new Dictionary<string, string>
        {
            { "test", "test" }
        };
        //address.TupleType = ("test", 1d);
        address.UnionType = "test";
        address.AdditionalProperties = new Dictionary<string, dynamic>
        {
            { "test", "test" }
        };

        string actualJsonString = JsonConvert.SerializeObject(address);
        string expectedJsonString = "{\"number_type\":1.0,\"boolean_type\":true,\"union_type\":\"test\",\"array_type_simple\":[\"test\",\"test2\"],\"array_type\":[1,\"test\"],\"tuple_type\":{\"Item1\":\"test\",\"Item2\":1.0},\"object_type\":{\"test\":\"test\"},\"dictionary_type\":{\"test\":\"test\"},\"enum_type\":\"{\\\"test\\\":2}\",\"test\":\"test\"}";
        Assert.That(actualJsonString, Is.EqualTo(expectedJsonString));
    }
}

