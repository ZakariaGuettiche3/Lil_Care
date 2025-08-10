"use client";
import {useEffect, useState} from "react";
import {GoogleMap, LoadScript, Marker} from "@react-google-maps/api";
import { ChildLocationData } from "@/types";
import { supabaseBrowser } from "@/lib/supabase/browser";
import {GOOGLE_MAP_KEY} from "@/lib/constant";

type Props = {
  location: {
    id: number;
    childId: number;
    sectionId: number;
    latitude: string;
    longitude: string;
    timestamp: Date;
    accuracy: string;
    speed: string | null;
    altitude: string | null;
  };
};

const MapLocation = ({ location }: Props) => {
  const [coord, setCoord] = useState<ChildLocationData>(location);

  useEffect(() => {
    const supabase = supabaseBrowser();

    const geolocalization = supabase
        .channel("geolocalization")
        .on(
            "postgres_changes",
            {event: "UPDATE", schema: "public", table: "child_geolocation"},
            (payload) => {
                setCoord(payload.new as ChildLocationData);
            }
        )
        .subscribe();

    return () => {
      geolocalization.unsubscribe();
    };
  }, []);

  return (
      <LoadScript googleMapsApiKey={GOOGLE_MAP_KEY}>
          <GoogleMap
              mapContainerStyle={{height: "200px", width: "100%"}}
              center={{
                  lat: parseFloat(coord?.latitude || "0"),
                  lng: parseFloat(coord?.longitude || "0"),
              }}
              zoom={10}
          >
              <Marker
                  position={{
                      lat: parseFloat(coord?.latitude || "0"),
                      lng: parseFloat(coord?.longitude || "0"),
                  }}
              />
          </GoogleMap>
      </LoadScript>
  );
};

export default MapLocation;
