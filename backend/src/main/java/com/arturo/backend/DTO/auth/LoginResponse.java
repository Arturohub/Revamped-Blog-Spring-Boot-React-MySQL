package com.arturo.backend.DTO.auth;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {

    private String jwtToken;
    private String username;
    private List<String> roles;

    public LoginResponse(String username, List<String> roles, String jwtToken){
        this.username = username;
        this.roles = roles;
        this.jwtToken = jwtToken;
    }

}
