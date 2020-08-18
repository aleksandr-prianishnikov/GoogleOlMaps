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

@Service
public class MarkerServiceImpl implements MarkerService {
    private final MarkerRepository repository;

    public MarkerServiceImpl(MarkerRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void savePoints(List<MarkerDto> dtos, UserDetails user) {
        checkAccess(user);
        List<Marker> points = dtos.stream()
                .map(dto -> new Marker()
                        .setRevNum(dto.getRevNum())
                        .setType(dto.getType())
                        .setCoords(dto.getCoords()
                                .stream()
                                .map(val -> new Coordinates()
                                        .setX(val.getCoordinates().get(0))
                                        .setY(val.getCoordinates().get(1)))
                                .collect(toList()))
                        .setUserLogin(user.getUsername())
                ).collect(toList());
        repository.deleteAllByUserLogin(user.getUsername()); // перезаписывать точки
        repository.saveAll(points);
    }

    @SneakyThrows
    private void checkAccess(UserDetails user) {
        if(user.getAuthorities()
                .stream()
                .noneMatch(grant -> grant.getAuthority().equals("ROLE_USER"))) {
            throw new IllegalAccessException("not enough grants");
        }
    }

    public List<MarkerDto> getPoints(UserDetails user) {
        checkAccess(user);
        List<MarkerDto> dtos = new ArrayList<>();
        List<Marker> userPoints =  repository.findAllByUserLogin(user.getUsername());
        for (Marker point : userPoints) {
            dtos.add(mapEntityToDto(point, dtos.size()));
        }
        return dtos;
    }

    private MarkerDto mapEntityToDto(Marker point, int pointId) {
        return new MarkerDto()
                .setId(pointId)
                .setType(point.getType())
                .setRevNum(point.getRevNum())
                .setCoords(mapCoords(point));
    }

    private List<com.example.GoogleOlMaps.web.dto.CoordinateDto> mapCoords(Marker point) {
        return point.getCoords()
                .stream()
                .map(coord -> new CoordinateDto(coord.getX(), coord.getY()))
                .collect(toList());
    }
}
