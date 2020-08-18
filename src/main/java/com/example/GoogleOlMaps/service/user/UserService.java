package com.example.GoogleOlMaps.service.user;

import com.example.GoogleOlMaps.web.dto.UserRegistrationDto;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import com.example.GoogleOlMaps.entity.user.User;

public interface UserService extends UserDetailsService{
    User save(UserRegistrationDto registrationDto);
}
