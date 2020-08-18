package com.example.GoogleOlMaps.web;

import com.example.GoogleOlMaps.service.marker.MarkerService;
import com.example.GoogleOlMaps.service.marker.MarkerServiceImpl;
import com.example.GoogleOlMaps.web.dto.MarkerDto;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/points")
public class MarkerController {
    private final MarkerServiceImpl service;

    public MarkerController(MarkerServiceImpl service) {
        this.service = service;
    }

    @PostMapping
    public void savePoints(@RequestBody List<MarkerDto> body, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        service.savePoints(body, userDetails);
    }

    @GetMapping
    public List<MarkerDto> getPoints(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return service.getPoints(userDetails);
    }
}