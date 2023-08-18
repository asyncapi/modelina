package Test_Go

import (
	"encoding/json"
	runtimego "runtimego/target"
	"testing"
)

func TestShouldbeAbleToSerializeModel(t *testing.T) {
	address := runtimego.Address{
		StreetName:           "Test Address 2",
		HouseNumber:          2.0,
		Marriage:             true,
		Members:              nil,
		ArrayType:            nil,
		NestedObject:         nil,
		AdditionalProperties: nil,
	}

	jsonBytes, err := json.Marshal(address)

	if err != nil {
		t.Fatalf("Failed to serialize Address to JSON: %v", err)
	}
	jsonStr := string(jsonBytes)

	if jsonStr == "" {
		t.Errorf("Serialize JSON is empty")
	}
}

func TestShouldNotContainAdditionalPropertiesWhenSerialized(t *testing.T) {
	address := runtimego.Address{
		StreetName:           "Test Address 2",
		HouseNumber:          2.0,
		Marriage:             true,
		Members:              nil,
		ArrayType:            nil,
		NestedObject:         nil,
		AdditionalProperties: nil,
	}

	jsonBytes, err := json.Marshal(address)

	if err != nil {
		t.Fatalf("Failed to serialize Address to JSON: %v", err)
	}

	var JsonObject map[string]interface{}

	if err := json.Unmarshal(jsonBytes, &JsonObject); err != nil {
		t.Fatalf("Failed to deserialize JSON: %v", err)
	}

	if _, found := JsonObject["AdditionalProperties"]; found {
		t.Errorf("Serialize JSON contains 'Additional Properties' key")
	}
}
