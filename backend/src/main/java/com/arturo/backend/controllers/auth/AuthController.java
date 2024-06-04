package com.arturo.backend.controllers.auth;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


import com.arturo.backend.DTO.auth.LoginForm;
import com.arturo.backend.DTO.auth.MyUser;
import com.arturo.backend.repository.auth.MyUserRepository;
import com.arturo.backend.service.auth.JwtService;
import com.arturo.backend.service.auth.MyUserDetailsService;

@RestController
public class AuthController {

    @Autowired
    private MyUserRepository myUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @GetMapping("/api/auth/users")
    public ResponseEntity<List<MyUser>> getAllUsers() {
    List<MyUser> users = myUserRepository.findAll();
    return new ResponseEntity<>(users, HttpStatus.OK);
}


    @GetMapping("/wtf")
    public ResponseEntity<String> handleLogin() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Sorry, wrong credentials. You don't have access to those features");
    }

    @PostMapping("/api/auth/register")
    public ResponseEntity<?> createUser(@RequestBody MyUser user){
        Optional<MyUser> existingUser = myUserRepository.findByUsername(user.getUsername());
        if(existingUser.isPresent()){
            return new ResponseEntity<>("Username already taken. Please, pick another one", HttpStatus.NOT_ACCEPTABLE);
        }
    
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if("arturochicavilla@hotmail.com".equals(user.getEmail())){
            user.setRole("ADMIN,USER");
        } else {
            user.setRole("USER");
        }
        myUserRepository.save(user);
        return new ResponseEntity<>("User registerd successfully!", HttpStatus.OK);
    }
    

    @PostMapping("api/auth/login")
    public String authenticateAndGetToken(@RequestBody LoginForm loginForm){
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginForm.username(), loginForm.password()));
        if(authentication.isAuthenticated()){
            return jwtService.generateToken(myUserDetailsService.loadUserByUsername(loginForm.username()));

        } else {
            throw new UsernameNotFoundException("Username and password not found. Please, try again or register");
        }
    }

    @PostMapping("/api/auth/logout")
    public void logout() {
        SecurityContextHolder.clearContext();
    }
    

}
