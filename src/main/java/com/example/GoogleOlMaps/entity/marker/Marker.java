package com.example.GoogleOlMaps.entity.marker;

import javax.persistence.*;
import java.util.List;


@Entity
@Table(name = "marker")
public class Marker {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String userLogin;
    private int revNum;
    private String type;
    @OneToMany(cascade = CascadeType.ALL)
    private List<Coordinates> coords;

    public String getUserLogin() {
        return userLogin;
    }

    public Marker setUserLogin(String userLogin) {
        this.userLogin = userLogin;
        return this;
    }

    public Long getId() {
        return id;
    }

    public Marker setId(Long id) {
        this.id = id;
        return this;
    }

    public int getRevNum() {
        return revNum;
    }

    public Marker setRevNum(int revNum) {
        this.revNum = revNum;
        return this;
    }

    public String getType() {
        return type;
    }

    public Marker setType(String type) {
        this.type = type;
        return this;
    }

    public List<Coordinates> getCoords() {
        return coords;
    }

    public Marker setCoords(List<Coordinates> coords) {
        this.coords = coords;
        return this;
    }
}
