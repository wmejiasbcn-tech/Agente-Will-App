import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_IMAGE, WORLD_NODES } from '../data/worldNodes';
import {
  imagePctToLeaflet,
  imageToWgs,
  leafletBounds,
  leafletToImagePct,
  wgsToImage,
} from '../utils/mapGeoref';

type MarkerPoint = { lat: number; lng: number; label?: string } | null;

interface WillWorldMapProps {
  marker: MarkerPoint;
  onSelectNode: (query: string, lat: number, lng: number) => void;
  onClickMap: (lat: number, lng: number) => void;
}

const goldIcon = L.divIcon({
  className: 'will-leaflet-pin',
  html: '<span class="will-leaflet-core"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export const WillWorldMap: React.FC<WillWorldMapProps> = ({
  marker,
  onSelectNode,
  onClickMap,
}) => {
  const host = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markRef = useRef<L.Marker | null>(null);
  const onSelectRef = useRef(onSelectNode);
  const onClickRef = useRef(onClickMap);
  onSelectRef.current = onSelectNode;
  onClickRef.current = onClickMap;

  useEffect(() => {
    if (!host.current || mapRef.current) return;
    const bounds = L.latLngBounds(leafletBounds());
    const map = L.map(host.current, {
      crs: L.CRS.Simple,
      minZoom: -1,
      maxZoom: 3,
      zoomControl: true,
      attributionControl: false,
      zoomSnap: 0.25,
    });
    L.imageOverlay(MAP_IMAGE.src, bounds).addTo(map);
    map.fitBounds(bounds);
    map.setMaxBounds(bounds.pad(0.08));

    for (const node of WORLD_NODES) {
      const ll = imagePctToLeaflet({ x: node.x, y: node.y });
      const m = L.circleMarker(ll, {
        radius: 5,
        color: '#e8c37a',
        weight: 1,
        fillColor: '#f3e0b0',
        fillOpacity: 0.9,
      });
      m.bindTooltip(node.label, { direction: 'top', opacity: 0.92 });
      m.on('click', () => onSelectRef.current(node.query, node.lat, node.lng));
      m.addTo(map);
    }

    map.on('click', (ev: L.LeafletMouseEvent) => {
      const pct = leafletToImagePct(ev.latlng.lat, ev.latlng.lng);
      const geo = imageToWgs(pct.x, pct.y);
      onClickRef.current(geo.lat, geo.lng);
    });

    mapRef.current = map;
    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      map.remove();
      mapRef.current = null;
      markRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!marker) {
      markRef.current?.remove();
      markRef.current = null;
      map.fitBounds(L.latLngBounds(leafletBounds()));
      return;
    }
    const pct = wgsToImage(marker.lat, marker.lng);
    const ll = imagePctToLeaflet(pct);
    if (!markRef.current) {
      markRef.current = L.marker(ll, { icon: goldIcon, keyboard: true }).addTo(map);
    } else {
      markRef.current.setLatLng(ll);
    }
    if (marker.label) markRef.current.bindTooltip(marker.label, { permanent: false });
    map.flyTo(ll, Math.max(map.getZoom(), 1.2), { duration: 0.7 });
  }, [marker]);

  return (
    <div className="world-stage arch-glass overflow-hidden">
      <div
        ref={host}
        className="will-leaflet"
        role="application"
        aria-label="Mapamundi de recursos"
      />
    </div>
  );
};
