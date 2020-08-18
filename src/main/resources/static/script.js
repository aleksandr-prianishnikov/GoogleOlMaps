var HANDLER_URI = '/points';

var osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

var lat = 50;
var lng = -70;
var zoom = 5;

var map = new ol.Map({
    layers: [
        osmLayer,
        new olgm.layer.Google()
    ],
    target: 'map',
    /*view: new ol.View({
        center: [-11000000, 4600000],
        zoom: 4
    })*/
    view: new ol.View({
        center: ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'),
        zoom: zoom
    })
});

var features = new ol.Collection();
var source   = new ol.source.Vector({
    features: features
});

setTimeout(function() {
    document.getElementById('load').style.display = 'inline';
    document.getElementById('save').style.display = 'inline';
}, 2000);

var featureOverlay = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        })
    })
});
featureOverlay.setMap(map);


//var xhr = null;

var request = function (obj, callback) {

    //if (xhr) xhr.abort();

    var xhr = new XMLHttpRequest();
    xhr.open(obj ? 'POST' : 'GET', HANDLER_URI, true);

    var body = obj ? JSON.stringify(obj) : null;
    if (obj) xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
            console.error(xhr.status, xhr.statusText);
            alert('Ошибка получения данных');
            return;
        }

        var json = JSON.parse(xhr.responseText);
        xhr = null;
        if (callback) callback(json);
    };

    xhr.send(body);
}


var lastdraw = null;
var lastmod = null;

var id = 0;
var objs = {};

var ajaxObj = [];

function redrawObjects() {
    var f = document.getElementById('features');
    f.innerHTML = '';

    ajaxObj = [];
    for (var objId in objs) {
        var obj = objs[objId];

        var type, coords;
        switch (obj.type) {
            case 'Point':
                type  = 'Метка';
                coords = obj.coords[0] + ', ' + obj.coords[1];
                break;

            case 'LineString':
                type = 'Ломаная';
                var aCoords = [];
                for (var x = 0; x < obj.coords.length; x++) {
                    aCoords.push(obj.coords[x][0] + ', ' + obj.coords[x][1]);
                }
                coords = aCoords.join('<br>\n');
                break;

            case 'Polygon':
                type = 'Многоугольник';
                var aCoords = [];
                for (var x = 0; x < obj.coords[0].length; x++) {
                    aCoords.push(obj.coords[0][x][0] + ', ' + obj.coords[0][x][1]);
                }
                coords = aCoords.join('<br>\n');
                break;
                break;
        }

        var tr = document.createElement('tr');
        var tds = [
            '<td>#' + objId  + '</td>',
            '<td>' + type   + '</td>',
            '<td>' + coords + '</td>',
            '<td><a href="#" class="del" data-id="' + objId + '" title="Удалить...">❌</a></td>'
        ];
        tr.innerHTML = tds.join('');
        f.appendChild(tr);

        ajaxObj.push({
            id: objId,
            type: obj.type,
            coords: obj.coords
        });
    }

    //request(ajaxObj);

    var as = document.getElementsByClassName('del');
    for (var i = 0; i < as.length; i++) {
        as[i].addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var a = e.target;
            var delId = a.dataset.id;

            e.target.parentNode.parentNode.remove();

            var features = source.getFeatures();
            if (features != null && features.length > 0) {
                for (x in features) {
                    var objId = features[x].getProperties().id;
                    // console.log('F1', objId, delId, objs);
                    if (objId == delId) {
                        // console.log('DD', objId, delId, objs);
                        source.removeFeature(features[x]);
                        break;
                    }
                }
            }

            // console.log('O1', objs, delId);
            delete objs[delId];
            // console.log('O2', objs, delId);

            var features = source.getFeatures();
            if (features != null && features.length > 0) {
                for (x in features) {
                    var objId = features[x].getProperties().id;
                    // console.log('F2', objId, delId, objs);
                }
            }


            redrawObjects();
        });
    }
}

var modify = new ol.interaction.Modify({
    features: features,
    deleteCondition: function(event) {
        return ol.events.condition.shiftKeyOnly(event) &&
            ol.events.condition.singleClick(event);
    }
});
map.addInteraction(modify);

modify.on('modifyend', function(evt) {
    lastmod = evt;
    var arr = evt.features.getArray();
    // console.log('modifyend', evt, arr, evt.features.getArray()[0].getGeometry().getCoordinates());

    var features = evt.features.getArray();
    for (var i = 0; i < features.length; i++) {
        var revNum = features[i].getRevision();
        var objId  = features[i].getProperties().id;
        // console.log('###', objs, objId, features[i].getProperties());
        if (revNum > objs[objId].revNum) {
            objs[objId].revNum = revNum;

            var newCoords = features[i].getGeometry().getCoordinates();
            var objName   = features[i].getProperties().name;
            var objType   = features[i].getProperties().type;

            objs[objId].coords = newCoords;

            // console.log(objId, objName, objType, newCoords, '#' + revNum);
        }
    }

    redrawObjects();
});

var draw; // global so we can remove it later
var typeSelect = document.getElementById('type');

var firstDraw = true;

function addInteraction() {
    draw = new ol.interaction.Draw({
        features: features,
        type: /** @type {ol.geom.GeometryType} */ (typeSelect.value)
    });
    map.addInteraction(draw);

    draw.on('drawend', function(evt) {
        lastdraw = evt;
        // console.log('drawend', evt, evt.feature.getGeometry().getCoordinates());

        var coords = evt.feature.getGeometry().getCoordinates();
        var name = typeSelect.value + '-' + (++id);

        evt.feature.setProperties({
            'id':   id,
            'name': name,
            'type': typeSelect.value
        });

        objs[id] = {
            revNum: 0,
            type: typeSelect.value,
            coords: coords
        }

        redrawObjects();
    });
}

/**
 * Handle change event.
 */
typeSelect.onchange = function() {
    map.removeInteraction(draw);
    addInteraction();
};

addInteraction();


var olGM = new olgm.OLGoogleMaps({
    map: map,
    mapIconOptions: {
        useCanvas: true
    }
});
olGM.activate();

var isOsm = true;
var isTerrain = false;

function switchMap() {

    // console.log(isOsm, isTerrain);

    if (isOsm) {
        document.getElementById('toggle-osm').innerText = 'Карта Google';
        document.getElementById('gm-add-ter').style.display = 'none';
    }
    else {
        document.getElementById('toggle-osm').innerText = 'Карта OSM';
        document.getElementById('gm-add-ter').style.display = 'inline';
    }

    document.getElementById('gm-add-ter').innerText = isTerrain ? 'Спутник' : 'Карта';
}

var toggleOsmLayer = function(opt_visible) {
    var visible = opt_visible !== undefined ? opt_visible : !osmLayer.getVisible();
    osmLayer.setVisible(visible);
    isOsm = !isOsm;
    switchMap();
};
document.getElementById('toggle-osm').onclick = function() {
    toggleOsmLayer();
};

var switchTerrain = function() {
    isTerrain = !isTerrain;

    if (isTerrain) {
        map.getLayers().push(new olgm.layer.Google({
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }));
    }
    else {
        map.getLayers().push(new olgm.layer.Google({
            mapTypeId: google.maps.MapTypeId.SATELLITE
        }));
    }

    switchMap();
}
document.getElementById('gm-add-ter').onclick = function() {
    switchTerrain();
};

switchTerrain();

document.getElementsByClassName('form-inline')[0].onsubmit = function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
}

document.getElementById('save').onclick = savePoints

function savePoints() {
    var dtos = buildDtos(objs);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", HANDLER_URI, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(dtos));
}

function buildDtos(objs) {
    var dtos = [];
    for (x in objs) {
        var unfixedObj = objs[x] // проблема в том, что у coords разный формат для разных типов фигур - надо унифицировать
        var fixedObj = objs[x]
        switch (unfixedObj.type) {
            case 'Point':
                fixedObj.coords = [unfixedObj.coords]
                break;
            case 'LineString': //correct format
                break;
            case 'Polygon':
                fixedObj.coords = unfixedObj.coords[0]
                break;
        }
        dtos.push(fixedObj)
    }
    return dtos
}

function drawObj(obj, id) {
    var feature;

    switch (obj.type) {
        case 'Point':
            feature = new ol.Feature(new ol.geom.Point(obj.coords));
            break;
        case 'LineString':
            feature = new ol.Feature(new ol.geom.LineString(obj.coords));
            break;
        case 'Polygon':
            //return;
            feature = new ol.Feature(new ol.geom.Polygon(obj.coords));
            break;
    }

    feature.setProperties({
        'id':   id,
        'name': obj.type + '-' + id,
        'type': obj.type
    });

    source.addFeature(feature);
}

document.getElementById('load').onclick = function(e) {
    e.target.disabled = true;
    request(null, function(result) {
        objs = {};
        id = 0;

        var c = 100;
        while (c--) {
            var features = source.getFeatures();
            if (features != null && features.length > 0) {
                for (x in features) {
                    source.removeFeature(features[x]);
                }
            }
        }

        for (var i = 0; i < result.length; i++) {
            if (result[i].id > id) id = result[i].id;
            var obj = {
                revNum: 0,
                type: result[i].type,
                coords: fixCoords(result[i])
            };
            drawObj(obj, result[i].id);
            objs[result[i].id] = obj;
        }
        redrawObjects();
        // console.log('loaded', result);
        e.target.disabled = false;
    });
}

// библиотека ожидает координаты не в едином формате
function fixCoords(unfixedObj) {
    switch (unfixedObj.type) {
        case 'Point':
            return unfixedObj.coords[0]
        case 'LineString': //correct format
            return unfixedObj.coords
        case 'Polygon':
            return [unfixedObj.coords]
    }
}
