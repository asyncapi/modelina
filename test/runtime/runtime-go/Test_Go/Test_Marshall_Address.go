package Test_Go

import (
	"encoding/json"
	runtimego "runtimego/target"
	"testing"
)

func Test(expected string, address runtimego.Address, t *testing.T) {
	// Marshalling Test
	serialized, err := json.Marshal(address)
	if err != nil {
		t.Errorf("Failed to serialize Address to JSON: %v", err)
	}

	serializedStr := string(serialized)
	if serializedStr != expected {
		t.Errorf("Expected marshalled JSON: %s, but got: %s", expected, serialized)
	}

	// Unmarshalling Test
	var newAddress runtimego.Address
	if err := json.Unmarshal([]byte(expected), &newAddress); err != nil {
		t.Fatalf("Failed to unmarshal JSON: %v", err)
	}
	reSerialized, err := json.Marshal(newAddress)
	if err != nil {
		t.Fatalf("Failed to marshal Address: %v", err)
	}
	reSerializedStr := string(reSerialized)

	if serializedStr != reSerializedStr {
		t.Errorf("Serialized JSON after unmarshalling does not match: %s", reSerializedStr)
	}
}

func TestAddressMarshalling(t *testing.T) {

	// Testing Address with Required Properties

	t.Run("required properties", func(t *testing.T) {
		address := runtimego.Address{
			StreetName:  "test",
			HouseNumber: 1,
			ArrayType:   []interface{}{1, "test"},
		}
		expected := "{\"street_name\": \"test\",\"house_number\": 1,\"array_type\": [1,\"test\"]}"

		Test(expected, address, t)
	})

	// Testing Address with Marriage

	t.Run("marriage", func(t *testing.T) {
		address := runtimego.Address{
			StreetName:  "test",
			HouseNumber: 1,
			Marriage:    true,
			ArrayType:   []interface{}{1, "test"},
		}
		expected := "{\"street_name\": \"test\",\"house_number\": 1,\"marriage\": true,\"array_type\": [1,\"test\"]}"

		Test(expected, address, t)

	})

	// Testing Address with Members

	t.Run("members", func(t *testing.T) {
		address := runtimego.Address{
			StreetName:  "test",
			HouseNumber: 1,
			ArrayType:   []interface{}{1, "test"},
			Members:     2,
		}
		expected := "{\"street_name\": \"test\",\"house_number\": 1,\"members\": 2,\"array_type\": [1,\"test\"]}"

		Test(expected, address, t)
	})

	// Testing Address with Nested Object

	t.Run("nestedObject", func(t *testing.T) {
		nestedObj := runtimego.NestedObject{
			Test: "test",
		}
		address := runtimego.Address{
			StreetName:   "test",
			HouseNumber:  1,
			ArrayType:    []interface{}{1, "test"},
			NestedObject: &nestedObj,
		}
		expected := "{\"street_name\": \"test\",\"house_number\": 1,\"array_type\": [1,\"test\"],\"nestedObject\": {\"test\": \"test\"}}"

		Test(expected, address, t)
	})

	// Testing Address Full Model

	t.Run("full model", func(t *testing.T) {
		nestedObj := runtimego.NestedObject{
			Test: "test",
		}
		address := runtimego.Address{
			StreetName:           "test",
			HouseNumber:          1,
			Marriage:             true,
			Members:              2,
			ArrayType:            []interface{}{1, "test"},
			NestedObject:         &nestedObj,
			AdditionalProperties: nil,
		}
		expected := "{\"street_name\": \"test\",\"house_number\": 1,\"marriage\": true,\"members\": 2,\"array_type\": [1,\"test\"],\"nestedObject\": {\"test\": \"test\"}}"

		Test(expected, address, t)
	})
}
