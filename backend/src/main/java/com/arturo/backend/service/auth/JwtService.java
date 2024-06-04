package com.arturo.backend.service.auth;

import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Service
public class JwtService {

   @Autowired
    private Environment env;
    private String SECRET;
    private Long VALIDITY;

    @PostConstruct
    public void init() {
        SECRET = env.getProperty("JWT_SECRET");
        VALIDITY = TimeUnit.MINUTES.toMillis(Long.parseLong(env.getProperty("TIME")));
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, String> claims = new HashMap<>();
        claims.put("iss", "https");
        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plusMillis(VALIDITY)))
                .signWith(generateKey())
                .compact();
    }

    private SecretKey generateKey() {
        byte[] decodedKey = Base64.getDecoder().decode(SECRET);
        return Keys.hmacShaKeyFor(decodedKey);
    }

    public String extractUsername(String jwt) {
        Claims claims = getClaims(jwt);
        return claims.getSubject();
    }

    private Claims getClaims(String jwt) {
        return Jwts.parser()
                .verifyWith(generateKey())
                .build()
                .parseSignedClaims(jwt)
                .getPayload();
    }

    public boolean isTokenValid(String jwt) throws JwtException {
        try {
            Claims claims = getClaims(jwt);
            if (claims.getExpiration().after(Date.from(Instant.now()))) {
                return true;
            } else {
                throw new JwtException("Please, you need to log in");
            }
        } catch (ExpiredJwtException e) {
            throw new JwtException("Please, you need to log in");
        } catch (JwtException e) {
            throw new JwtException("Please, you need to log in");
        }
    }

}
