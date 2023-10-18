package com.mycompany.app.generic;
import com.mycompany.app.generic.NestedObject;
import java.util.Map;
import com.fasterxml.jackson.annotation.*;
public class Address {
  @JsonProperty("street_name")
  private String streetName;
  @JsonProperty("house_number")
  private Double houseNumber;
  @JsonProperty("marriage")
  private boolean marriage;
  @JsonProperty("members")
  private Object members;
  @JsonProperty("array_type")
  private Object[] arrayType;
  @JsonProperty("nestedObject")
  private NestedObject nestedObject;
  private Map<String, Object> additionalProperties;

  public String getStreetName() { return this.streetName; }
  public void setStreetName(String streetName) { this.streetName = streetName; }

  public Double getHouseNumber() { return this.houseNumber; }
  public void setHouseNumber(Double houseNumber) { this.houseNumber = houseNumber; }

  public boolean getMarriage() { return this.marriage; }
  public void setMarriage(boolean marriage) { this.marriage = marriage; }

  public Object getMembers() { return this.members; }
  public void setMembers(Object members) { this.members = members; }

  public Object[] getArrayType() { return this.arrayType; }
  public void setArrayType(Object[] arrayType) { this.arrayType = arrayType; }

  public NestedObject getNestedObject() { return this.nestedObject; }
  public void setNestedObject(NestedObject nestedObject) { this.nestedObject = nestedObject; }

  public Map<String, Object> getAdditionalProperties() { return this.additionalProperties; }
  public void setAdditionalProperties(Map<String, Object> additionalProperties) { this.additionalProperties = additionalProperties; }
}