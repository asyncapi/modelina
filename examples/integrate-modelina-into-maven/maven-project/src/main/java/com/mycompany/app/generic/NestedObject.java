package com.mycompany.app.generic;

import java.util.Map;
import com.fasterxml.jackson.annotation.*;
public class NestedObject {
  @JsonProperty("test")
  private String test;
  private Map<String, Object> additionalProperties;

  public String getTest() { return this.test; }
  public void setTest(String test) { this.test = test; }

  public Map<String, Object> getAdditionalProperties() { return this.additionalProperties; }
  public void setAdditionalProperties(Map<String, Object> additionalProperties) { this.additionalProperties = additionalProperties; }
}