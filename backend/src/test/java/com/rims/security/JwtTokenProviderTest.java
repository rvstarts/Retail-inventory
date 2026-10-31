package com.rims.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;
    private final String secretKey = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(tokenProvider, "secretKey", secretKey);
        ReflectionTestUtils.setField(tokenProvider, "jwtExpiration", 3600000L); // 1 hour
        ReflectionTestUtils.setField(tokenProvider, "refreshExpiration", 86400000L); // 24 hours
    }

    @Test
    @DisplayName("Should generate valid JWT token for authenticated principal")
    void testGenerateToken() {
        User user = new User("admin", "pass", List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
        Authentication auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

        String token = tokenProvider.generateToken(auth);

        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));
        assertEquals("admin", tokenProvider.getUsernameFromJwt(token));
    }

    @Test
    @DisplayName("Should reject invalid or malformed token")
    void testInvalidToken() {
        assertFalse(tokenProvider.validateToken("invalid.token.string"));
    }
}

