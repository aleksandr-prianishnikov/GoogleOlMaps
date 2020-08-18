package com.example.GoogleOlMaps.web.dto;

import java.util.List;

public class MarkerDto {
    private Integer id;
    private int revNum;
    private String type;
    private List<CoordinateDto> coords;

    public String getType() {
        return type;
    }

    public MarkerDto setType(String type) {
        this.type = type;
        return this;
    }

    public int getRevNum() {
        return revNum;
    }

    public MarkerDto setRevNum(int revNum) {
        this.revNum = revNum;
        return this;
    }

    public Integer getId() {
        return id;
    }

    public MarkerDto setId(Integer id) {
        this.id = id;
        return this;
    }

    public List<CoordinateDto> getCoords() {
        return coords;
    }

    public MarkerDto setCoords(List<CoordinateDto> coords) {
        this.coords = coords;
        return this;
    }
}
