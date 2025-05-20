package com.example.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JwtUtil {
private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

@Value("${jwt.secret}")
private String secretKey;

@Value("${jwt.expiration-time:3600000}")
private long expirationTime;


public Key getSigningKey() {
    return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
}


public String generateToken(String username, String role) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("role", role); 
    return createToken(claims, username);
}

public String createToken(Map<String, Object> claims, String subject) {
    logger.debug("Creating token for subject: {}", subject); 
    return Jwts.builder()
            .setClaims(claims)
            .setSubject(subject)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
}

public Claims extractAllClaims(String token) {
    try {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    } catch (JwtException e) {
        logger.error("JWT parsing error: {}", e.getMessage());
        throw new RuntimeException("Invalid or expired JWT token", e);
    }
}


public String extractUsername(String token) {
    return extractAllClaims(token).getSubject();
}

public String extractRole(String token) {
    return extractAllClaims(token).get("role", String.class); 
}


public boolean isTokenExpired(String token) {
    Date expirationDate = extractAllClaims(token).getExpiration();
    if (expirationDate == null) {
        logger.error("Expiration date is null in the token.");
        throw new RuntimeException("Token expiration date is missing.");
    }
    boolean isExpired = expirationDate.before(new Date());
    logger.debug("Token expired: {}", isExpired); 
    return isExpired;
}


public boolean validateToken(String token, String username) {
    String extractedUsername = extractUsername(token);
    boolean isValid = (extractedUsername.equals(username) && !isTokenExpired(token));
    logger.debug("Token validation result for username '{}': {}", username, isValid);
    return isValid;
}

}
