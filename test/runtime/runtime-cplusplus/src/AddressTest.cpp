
#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "lib/doctest.h"
#include "lib/nlohmann/json.hpp"

#include <string>
#include <vector>

#include "lib/generated/address.hpp"
#include "lib/generated/nested_object.hpp"

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
    array_type.push_back("test");
    address.array_type = array_type;
    AsyncapiModels::nested_object obj;
    obj.test = "test";
    address.nested_object = obj;

    json jsonData = {
        {"streetName", address.street_name},
        {"houseNumber", address.house_number},
        {"marriage", address.marriage},
        {"members", address.members},
        {"arrayType", address.array_type},
        {"nestedObject", {{"test", address.nested_object.}}}};

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
    array_type.push_back("test");
    address.array_type = array_type;
    AsyncapiModels::nested_object obj;
    obj.test = "test";
    address.nested_object = obj;

    json jsonData = {
        {"streetName", address.street_name},
        {"houseNumber", address.house_number},
        {"marriage", address.marriage},
        {"members", address.members},
        {"arrayType", address.array_type},
        {"nestedObject", {{"test", address.nested_object}}},
        {"additionalProperties", "additionalValue"}};

    std::string jsonStr = jsonData.dump();
    CHECK(jsonStr.find("additionalProperties") == std::string::npos);
}