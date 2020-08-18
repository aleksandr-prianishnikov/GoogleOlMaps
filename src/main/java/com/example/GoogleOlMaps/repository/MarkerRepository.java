package com.example.GoogleOlMaps.repository;

import com.example.GoogleOlMaps.entity.marker.Marker;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface MarkerRepository extends CrudRepository<Marker, Long> {
    List<Marker> findAllByUserLogin(String userLogin);
    void deleteAllByUserLogin(String userLogin);
    //DELETE * FROM points WHERE userLogin = 'mylogin';

}
