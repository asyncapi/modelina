package com.mycompany.app;

import com.fasterxml.jackson.annotation.*;
public class AnonymousSchema_1 {
  @JsonProperty("email")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private String email;

  public String getEmail() { return this.email; }
  public void setEmail(String email) { this.email = email; }
}