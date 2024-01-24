import unittest
import json
from main.Address import Address
from main.NestedObject import NestedObject

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
    