import { useState } from 'react';
import { db } from '@/services/firebase';
import { collection, addDoc } from 'firebase/firestore';

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
  const addEvent = async (newEvent: Event) => {
    try {
      const docRef = await addDoc(collection(db, "events"), newEvent);
      setEvents((prev) => [...prev, { ...newEvent, id: docRef.id }]);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // Acil durum olayını ekler
  const addEmergencyEvent = async (newEvent: Event) => {
    try {
      const docRef = await addDoc(collection(db, "events"), { ...newEvent, isEmergency: true });
      setEvents((prev) => [...prev, { ...newEvent, id: docRef.id, isEmergency: true }]);
      console.log("Emergency document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
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