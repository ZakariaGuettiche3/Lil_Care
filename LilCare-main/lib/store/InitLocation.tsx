"use client";
import React, { useEffect } from "react";
import { updateLocation } from "@/server/children";

export default function InitLocation({ section }: { section: number }) {
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const coords = updateLocation({
        sectionId: section,
        latitude: `${position.coords.latitude}`,
        longitude: `${position.coords.longitude}`,
        accuracy: `${position.coords.accuracy}`,
        
      }).then((res) => {
        console.log(res);
    });
    })
    
    
    ;
  }, [section]);

  return <></>;
}
