using com.mycompany.app.json_serializer;
using System.Text.Json;

namespace runtime_csharp.json_serializer;

public class TestObjectTest
{

    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void TestSerializingFullModel()
    {
        TestObject testobject = new();
        ObjectType nestedObject = new();
        nestedObject.Test = "test";
        testobject.ObjectType = nestedObject;
        testobject.BooleanType = true;
        testobject.NumberType = 1;
        testobject.ArrayType = new dynamic[] { 1, "test" };
        testobject.EnumType = EnumType.CURLYLEFT_QUOTATION_TEST_QUOTATION_COLON_2_CURLYRIGHT;
        testobject.ArrayTypeSimple = new string[] { "test", "test2" };
        testobject.DictionaryType = new Dictionary<string, string>
        {
            { "test", "test" }
        };
        testobject.TupleType = ("test", 1d);
        testobject.UnionType = "test";
        testobject.AdditionalProperties = new Dictionary<string, dynamic>
        {
            { "test", "test" }
        };

        string actualJsonString = JsonSerializer.Serialize(testobject);
        string expectedJsonString = "{\"number_type\":1,\"boolean_type\":true,\"union_type\":\"test\",\"array_type_simple\":[\"test\",\"test2\"],\"array_type\":[1,\"test\"],\"tuple_type\":[\"test\",1],\"object_type\":{\"test\":\"test\"},\"dictionary_type\":{\"test\":\"test\"},\"enum_type\":{\"test\":2},\"test\":\"test\"}";
        Assert.That(actualJsonString, Is.EqualTo(expectedJsonString));
    }
}

