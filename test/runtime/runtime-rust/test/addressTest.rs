#[cfg(test)]
mod address_test {
    use super::*;
    use serde_json::json;

    #[test]
    fn should_be_able_to_serialize_model() {
        let address = Address {
            street_name: String::from("Test address 2"),
            house_number: 2.0,
            marriage: None,
            members: None,
            array_type: vec![],
            nested_object: None,
            additional_properties: None,
        };

        let json = serde_json::to_string(&address).unwrap();
        assert_ne!(json, "");
    }

    #[test]
    fn should_not_contain_additional_properties_when_serialized() {
        let address = Address {
            street_name: String::from("Test address 2"),
            house_number: 2.0,
            marriage: None,
            members: None,
            array_type: vec![],
            nested_object: None,
            additional_properties: None,
        };

        let json = serde_json::to_value(&address).unwrap();
        assert!(!json.as_object().unwrap().contains_key("additionalProperties"));
    }
}
