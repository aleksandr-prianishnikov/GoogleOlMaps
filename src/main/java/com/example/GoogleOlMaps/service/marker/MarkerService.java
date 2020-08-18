package com.example.GoogleOlMaps.service.marker;

import com.example.GoogleOlMaps.entity.marker.Coordinates;
import com.example.GoogleOlMaps.entity.marker.Marker;
import com.example.GoogleOlMaps.repository.MarkerRepository;
import com.example.GoogleOlMaps.web.dto.CoordinateDto;
import com.example.GoogleOlMaps.web.dto.MarkerDto;
import lombok.SneakyThrows;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

import static java.util.stream.Collectors.toList;


public interface MarkerService {
    void savePoints(List<MarkerDto> dtos, UserDetails user);
}
