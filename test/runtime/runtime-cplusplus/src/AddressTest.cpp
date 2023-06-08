
#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "utils/doctest.h"
#include "utils/nlohmann/json.hpp"

#include <string>
#include <vector>

#include "lib/generated/address.hpp"

using json = nlohmann::json;

TEST_CASE("Should be able to serialize C++ model")
{
    AsyncapiModels::address address;
    address.street_name = "Test address 2";
    address.house_number = 2.0;
    address.marriage = true;
    address.members = 2.0;
    std::vector<std::variant<std::string, double, std::any>> array_type;
    array_type.push_back(2.0);
    array_type.push_back(std::string("test"));
    address.array_type = array_type;
    AsyncapiModels::nested_object obj;
    obj.test = "test";
    address.nested_object = obj;

    std::vector<std::string> stringVector;
    for (const auto &item : array_type)
    {
        if (auto str = std::get_if<std::string>(&item))
        {
            stringVector.push_back(*str);
        }
    }

    json jsonData;
    jsonData["streetName"] = address.street_name;
    jsonData["houseNumber"] = address.house_number;
    jsonData["marriage"] = address.marriage.value();
    jsonData["members"] = std::get<double>(address.members.value());
    jsonData["arrayType"] = stringVector;
    jsonData["nestedObject"] = {{"test", address.nested_object.value().test.value()}};

    std::string jsonStr = jsonData.dump();
    CHECK(jsonStr.length() > 0);
}

TEST_CASE("Should not contain additional properties when serialized")
{
    AsyncapiModels::address address;
    address.street_name = "Test address 2";
    address.house_number = 2.0;
    address.marriage = true;
    address.members = 2.0;
    std::vector<std::variant<std::string, double, std::any>> array_type;
    array_type.push_back(2.0);
    array_type.push_back(std::string("test"));
    address.array_type = array_type;
    AsyncapiModels::nested_object obj;
    obj.test = "test";
    address.nested_object = obj;

    std::vector<std::string> stringVector;
    for (const auto &item : array_type)
    {
        if (auto str = std::get_if<std::string>(&item))
        {
            stringVector.push_back(*str);
        }
    }

    json jsonData;
    jsonData["streetName"] = address.street_name;
    jsonData["houseNumber"] = address.house_number;
    jsonData["marriage"] = address.marriage.value();
    jsonData["members"] = std::get<double>(address.members.value());
    jsonData["arrayType"] = stringVector;
    jsonData["nestedObject"] = {{"test", address.nested_object.value().test.value()}};

    std::string jsonStr = jsonData.dump();
    std::cout << jsonStr << std::endl;
    CHECK(jsonStr.find("additionalProperties") == std::string::npos);
}