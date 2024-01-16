import unittest
import json

class Address:
    def __init__(self, street_name, house_number, marriage, members, array_type, nested_object):
        self.street_name = street_name
        self.house_number = house_number
        self.marriage = marriage
        self.members = members
        self.array_type = array_type
        self.nested_object = nested_object

    def to_json(self):
        return json.dumps(self.__dict__)    
    
class NestedObject:
    def __init__(self, test):
        self.test = test

class TestAddress(unittest.TestCase):

    def setUp(self):
        nested_obj = NestedObject("test")
        self.address = Address("Test address 2", 2, True, 2, [2, "test"], nested_obj)

    def test_serialize_model(self):
        json_str = self.address.to_json()
        self.assertIsNotNone(json_str)
        self.assertGreater(len(json_str), 0)

    def test_no_additional_properties(self):
        json_str = self.address.to_json()
        self.assertNotIn('additionalProperties', json_str)

if __name__ == '__main__':
    unittest.main()
    