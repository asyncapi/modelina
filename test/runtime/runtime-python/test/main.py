import unittest
import sys
sys.path.insert(1, '../src/main/')
from Address import Address
from NestedObject import NestedObject
import json
    
class TestAddress(unittest.TestCase):
    @classmethod
    def setUpClass(cls) :
        cls.address = Address(input=type('obj', (object,),{
            'streetName' : "Test address 2",
            'houseNumber' : 2,
            'marriage' : True,
            'members' : 2,
            'arrayType' : [2, "test"],
            'nestedObject' : NestedObject('test'),
            'enumTest' : 'TEST',
            'houseType' : 'DETACHED',
            'roofType' : 'TILE',
            

        })) 
   

    def test_serializeToJson(self):
        json_str =self.address.serializeToJson()
        self.assertIsInstance(json_str, str)   

    def test_should_not_contain_additional_properties_when_serialized(self):
        json_str = self.address.serializeToJson()
        self.assertNotIn('additionalProperties', json_str)

   


if __name__ == '__main__':
    unittest.main()