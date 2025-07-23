'use client';

import { useState, useEffect } from 'react';
import { Text } from 'grommet';

export default function LocationDisplay({ lat, lng }) {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAddress() {
      if (!lat || !lng) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat, lng }),
        });
        const data = await res.json();
        setAddress(data.address || 'Location not found');
      } catch (error) {
        setAddress('Could not load location');
      } finally {
        setIsLoading(false);
      }
    }
    fetchAddress();
  }, [lat, lng]);

  if (isLoading) {
    return <Text size="small">Loading location...</Text>;
  }

  return <Text>{address}</Text>;
}