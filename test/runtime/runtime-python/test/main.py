import unittest
import sys
sys.path.insert(1, '../src/main/')
from Address import Address
from NestedObject import NestedObject
import json
  
class AddressData:
    def __init__(self, data):
        for key,value in data.items():
            setattr(self, key, value)
class Data:
    def __init__(self, data):
        self.__dict__ = data
data =    {
            'streetName': 'Test Street',
            'houseNumber': 123,
            'marriage': True,
            'members': 3,
            'arrayType': ['test1', 'test2'],
            'nestedObject': {'test': 'test', 'additionalProperties': {'prop': 'value'}},
            'additionalProperties': {'prop': 'value'}
        }
data_obj = Data(data)       
class TestAddress(unittest.TestCase):
    def setUp(self):
        self.address = Address(data_obj)
        

    def test_serializeToJson(self):
        json_str =self.address.serializeToJson()
        
        self.assertIsInstance(json_str, str)    

    def test_deserializeFromJson(self):
        json_str = self.address.serializeToJson()
        json_obj = json.loads(json_str)
        # Strip leading underscore from the key
        json_obj = {k[1:]: v for k, v in json_obj.items()}
        data_obj = AddressData(json_obj)
        address = Address(data_obj)
        self.assertIsInstance(address, Address)
        self.assertEqual(address.streetName, self.address.streetName)
        self.assertEqual(address.houseNumber, self.address.houseNumber)
        self.assertEqual(address.marriage, self.address.marriage)
        self.assertEqual(address.members, self.address.members)
        self.assertEqual(address.arrayType, self.address.arrayType)
        self.assertEqual(address.nestedObject, self.address.nestedObject)
        self.assertEqual(address.additionalProperties, self.address.additionalProperties)    
    


if __name__ == '__main__':
    unittest.main()