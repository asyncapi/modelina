
#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "utils/doctest.h"
// #include "utils/nlohmann/json.hpp"

#include <string>
#include <vector>

#include "lib/generated/address.hpp"

// using json = nlohmann::json;

TEST_CASE("Should make an object of the generated class")
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
}
