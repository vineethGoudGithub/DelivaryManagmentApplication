	package com.example.demo.controller;
	import java.util.Map;

	import com.example.demo.dto.LoginRequest;
	import com.example.demo.entity.User;
	import com.example.demo.enu.Role;
	import com.example.demo.request.SignUpRequest;
	import com.example.demo.service.UserService;
	import com.example.security.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.http.*;
	import org.springframework.web.bind.annotation.*;
	
	@RestController
	@RequestMapping("/api/users")
	@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*") // Allowing the React app to make requests
	public class UserController {
	
	    @Autowired
	    private UserService userService;
	
	    @Autowired
	    private JwtUtil jwtUtil;
	    @PostMapping("/signup")
	    public ResponseEntity<String> signUp(@RequestBody SignUpRequest signUpRequest) {
	        try {
	           
	            System.out.println("Received role: " + signUpRequest.getRole());

	           
	            Role roleEnum = Role.valueOf(signUpRequest.getRole().toUpperCase());

	            User newUser = userService.signUp(
	                    signUpRequest.getEmail(),
	                    signUpRequest.getPassword(),
	                    signUpRequest.getPhoneNumber(),
	                    roleEnum
	            );
	            return new ResponseEntity<>("User successfully created with role: " + newUser.getRole(), HttpStatus.CREATED);
	        } catch (IllegalArgumentException e) {
	          
	            System.out.println("Error occurred: " + e.getMessage());
	            return new ResponseEntity<>("Invalid role specified", HttpStatus.BAD_REQUEST);
	        }
	    }

	    @PostMapping("/login")
	    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
	        try {
	            Role roleEnum = Role.valueOf(loginRequest.getRole().toUpperCase());

	            boolean isAuthenticated = userService.login(
	                    loginRequest.getEmail(),
	                    loginRequest.getPassword(),
	                    roleEnum
	            );

	            if (isAuthenticated) {
	                String token = jwtUtil.generateToken(
	                        loginRequest.getEmail(),
	                        roleEnum.toString()
	                );
	                System.out.println("Generated JWT Token: " + token);

	                // Optional: Set as cookie (only if needed)
	                Cookie cookie = new Cookie("auth_token", token);
	                cookie.setHttpOnly(true);  
	                cookie.setSecure(true);   
	                cookie.setPath("/");     
	                cookie.setMaxAge(3600);   
	                response.addCookie(cookie); 

	               
	                return ResponseEntity.ok(Map.of("token", token));
	            } else {
	                return new ResponseEntity<>("Invalid email, password, or role", HttpStatus.UNAUTHORIZED);
	            }
	        } catch (IllegalArgumentException e) {
	            return new ResponseEntity<>("Invalid role specified", HttpStatus.BAD_REQUEST);
	        }
	    }
	    @GetMapping("/logout")
	    public ResponseEntity<String> logout(HttpServletRequest request) {
	        
	        return new ResponseEntity<>("Logged out successfully", HttpStatus.OK);
	    }
	
	 
	    @GetMapping("/profile")
	    public ResponseEntity<User> getProfile(HttpServletRequest request) {
	       
	        String username = jwtUtil.extractUsername(getJwtFromRequest(request));
	
	        if (username != null) {
	            User loggedInUser = userService.getUserByEmail(username);
	            return new ResponseEntity<>(loggedInUser, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	        }
	    }
	
	   
	    @GetMapping("/admin")
	    public ResponseEntity<String> adminPage(HttpServletRequest request) {
	        String username = jwtUtil.extractUsername(getJwtFromRequest(request));
	
	        if (username != null && userService.hasRole(username, Role.ADMIN)) {
	            return new ResponseEntity<>("Welcome, Admin!", HttpStatus.OK);
	        }
	        return new ResponseEntity<>("Access Denied: Admins Only", HttpStatus.FORBIDDEN);
	    }
	
	    
	    @GetMapping("/delivery")
	    public ResponseEntity<String> deliveryPage(HttpServletRequest request) {
	        String username = jwtUtil.extractUsername(getJwtFromRequest(request));
	
	        if (username != null && userService.hasRole(username, Role.DELIVERY_PERSON)) {
	            return new ResponseEntity<>("Welcome, Delivery Person!", HttpStatus.OK);
	        }
	        return new ResponseEntity<>("Access Denied: Delivery Personnel Only", HttpStatus.FORBIDDEN);
	    }
	
	    @GetMapping("/customer")
	    public ResponseEntity<String> customerPage(HttpServletRequest request) {
	        String username = jwtUtil.extractUsername(getJwtFromRequest(request));
	
	        if (username != null && userService.hasRole(username, Role.CUSTOMER)) {
	            return new ResponseEntity<>("Welcome, Customer!", HttpStatus.OK);
	        }
	        return new ResponseEntity<>("Access Denied: Customers Only", HttpStatus.FORBIDDEN);
	    }
	

	    private String getJwtFromRequest(HttpServletRequest request) {
	        String bearerToken = request.getHeader(HttpHeaders.AUTHORIZATION);
	        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
	            return bearerToken.substring(7);
	        }
	        return null;
	    }
	}
