package com.example.GoogleOlMaps.entity.marker;

import javax.persistence.*;
import java.math.BigDecimal;


@Entity
@Table(name = "coordinates")
public class Coordinates {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private BigDecimal x;

    private BigDecimal y;

    @ManyToOne(cascade = CascadeType.ALL)
    private Marker point;

    public Marker getPoint() {
        return point;
    }

    public Coordinates setPoint(Marker point) {
        this.point = point;
        return this;
    }


    public Long getId() {
        return id;
    }

    public Coordinates setId(Long id) {
        this.id = id;
        return this;
    }

    public BigDecimal getX() {
        return x;
    }

    public Coordinates setX(BigDecimal x) {
        this.x = x;
        return this;
    }   

    public BigDecimal getY() {
        return y;
    }

    public Coordinates setY(BigDecimal y) {
        this.y = y;
        return this;
    }
}
