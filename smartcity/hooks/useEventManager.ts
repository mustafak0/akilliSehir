import { useState } from 'react';

interface Event {
  id: string;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  radius?: number; // Özellikle acil durum olayları için kullanılabilir
  isEmergency?: boolean; // Acil durum olaylarını işaretlemek için
}

export function useEventManager() {
  const [events, setEvents] = useState<Event[]>([]);

  // Yeni bir olay ekler
  const addEvent = (newEvent: Event) => {
    setEvents((prev) => [...prev, newEvent]);
  };

  // Acil durum olayını ekler
  const addEmergencyEvent = (newEvent: Event) => {
    setEvents((prev) => [
      ...prev,
      { ...newEvent, isEmergency: true }, // Acil durum bayrağı ekleniyor
    ]);
  };

  // Belirli bir türdeki olayları filtreler
  const filterEvents = (type: string) => {
    return events.filter((event) => event.type === type);
  };

  // Sadece acil durum olaylarını döndürür
  const getEmergencyEvents = () => {
    return events.filter((event) => event.isEmergency);
  };

  return {
    events,
    addEvent,
    addEmergencyEvent,
    filterEvents,
    getEmergencyEvents,
  };
}
