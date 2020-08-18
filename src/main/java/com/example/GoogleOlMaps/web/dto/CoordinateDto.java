package com.example.GoogleOlMaps.web.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.math.BigDecimal;
import java.util.List;

import static java.util.Arrays.asList;

public class CoordinateDto {

    public CoordinateDto() {

    }

    public CoordinateDto(BigDecimal x, BigDecimal y) {
        this.coordinates = asList(x, y);
    }

    @JsonCreator
    public CoordinateDto(List<BigDecimal> coordinates) {
        this.coordinates = coordinates;
    }

    private List<BigDecimal> coordinates;

    @JsonValue
    public List<BigDecimal> getCoordinates() {
        return coordinates;
    }

    public CoordinateDto setCoordinates(List<BigDecimal> coordinates) {
        this.coordinates = coordinates;
        return this;
    }
}
