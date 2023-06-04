import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: "AIzaSyDIjXXnDF_9_DxPKiXamCzgkZFrwENWJHc",
  version: "weekly",
});

var map,
  startMarker = { setMap:function(){} },
  endMarker = { setMap:function(){} },
  trackPath = { setMap:function(){} },
  count = 0

const ManTrackMap = ({ trackPoints }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const boundsRef = useRef(null);

  useEffect(() => {
    loader.load().then(() => {
      if(count == 1){
        map = new google.maps.Map(mapRef.current, {
          center: { lat: 17.7749, lng: -112.4194 },
          zoom: 11, // Change zoom level to 11
        })
      }
    }).then(()=>{
        trackPath = new google.maps.Polyline({
          path: trackPoints,
          geodesic: true,
          strokeColor: "#FF0000",
          strokeOpacity: 1.0,
          strokeWeight: 2,
        });
        trackPath.setMap(map);

        startMarker = new google.maps.Marker({
          position: trackPoints[0],
          icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|42EF54',
          map,
          title: "Start",
        });

        endMarker = new google.maps.Marker({
          position: trackPoints[trackPoints.length - 1],
          map,
          title: "End",
        });

        markersRef.current = [startMarker, endMarker];
        boundsRef.current = new google.maps.LatLngBounds();

        trackPoints.forEach((point) => {
          boundsRef.current.extend(point);
        });

        map.fitBounds(boundsRef.current);
    })

    return () => {trackPath.setMap(null); endMarker.setMap(null); startMarker.setMap(null); count++}

  }, [trackPoints]);

  useLayoutEffect(() => {
    if (markersRef.current.length > 0) {
      markersRef.current[0].setPosition(trackPoints[0]);
      markersRef.current[1].setPosition(trackPoints[trackPoints.length - 1]);
    }
    if (boundsRef.current && mapRef.current) {
      // mapRef.current.fitBounds(boundsRef.current);
    }
  }, [trackPoints]);

  return <div ref={mapRef} className="w-full h-[50vh]" />;
};

export default ManTrackMap;

