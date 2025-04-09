package com.kiit.productManagementApp.security;



import java.util.Date;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

@Component
public class tokenCraft {

	
    private static final String SECRET_KEY = "WW91clN1cGVyU2VjdXJlU2VjcmV0S2V5TXVzdEJlQXRMZWFzdDMyQnl0ZXM="; // ✅ Base64 encoded secret
	    private final long VALIDITY = 1000 * 60 * 60; // 1 ghanta valid

	    public String banawoToken(String username, String role) {
	        return Jwts.builder()
	                .setSubject(username)
	                .claim("role", role)
	                .setIssuedAt(new Date())
	                .setExpiration(new Date(System.currentTimeMillis() + VALIDITY))
	                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
	                .compact();
	    }

	    public String nikaloUsername(String token) {
	        try {
	            // Yeh check ensure karega ki token format valid hai
	            if (token == null || token.split("\\.").length != 3) {
	                throw new MalformedJwtException("Invalid JWT format");
	            }

	            return Jwts.parserBuilder()
	                    .setSigningKey(SECRET_KEY)
	                    .build()
	                    .parseClaimsJws(token)
	                    .getBody()
	                    .getSubject();
	        } catch (Exception ex) {
	            System.out.println("JWT parse error: " + ex.getMessage());
	            throw ex;
	        }
	    }


	    public boolean checkKaro(String token) {
	        try {
	            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
	            return true;
	        } catch (JwtException | IllegalArgumentException e) {
	            return false;
	        }
	    }
	    
	    
}
