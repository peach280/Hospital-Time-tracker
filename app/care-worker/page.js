'use client';

import { useState, useEffect } from 'react';
import { Box, Button, TextArea, Heading, Text } from 'grommet';
import { useAuth0 } from '@auth0/auth0-react'; 

export default function CareWorkerPage() {
  const { user, isLoading } = useAuth0(); 
  const [note, setNote] = useState('');
  const [activeShift, setActiveShift] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleClockAction = () => {
    setIsSubmitting(true);
    setMessage('');

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const endpoint = activeShift ? '/api/clockout' : '/api/clockin';

      try {
        if (!activeShift) { 
          const perimeterRes = await fetch('/api/perimeter-check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: latitude, lng: longitude }),
          });
          const perimeterData = await perimeterRes.json();
          if (!perimeterData.allowed) {
            setMessage('You are outside the allowed perimeter to clock in.');
            setIsSubmitting(false);
            return;
          }
        }

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.sub, lat: latitude, lng: longitude, note }),
        });
        const data = await res.json();

        if (data.success) {
          setActiveShift(data.shift.clockOutTime ? null : data.shift);
          setMessage(`Successfully clocked ${activeShift ? 'out' : 'in'}!`);
          setNote('');
        } else {
          setMessage(data.message || 'An error occurred.');
        }
      } catch (error) {
        setMessage('Failed to perform action.');
      } finally {
        setIsSubmitting(false);
      }
    }, (error) => {
      setMessage(`Geolocation error: ${error.message}`);
      setIsSubmitting(false);
    });
  };

  if (isLoading) return <Box pad="large"><Text>Loading user...</Text></Box>;

  return (
    <Box pad="medium" gap="medium" width="large">
      <Heading>Care Worker Clock In/Out</Heading>
      <Text>
        Status: You are currently <b>{activeShift ? 'Clocked In' : 'Clocked Out'}</b>
      </Text>
      <TextArea
        placeholder="Optional note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={isSubmitting}
      />
      <Box align="start">
        <Button
          label={activeShift ? 'Clock Out' : 'Clock In'}
          onClick={handleClockAction}
          primary={!activeShift}
          color={activeShift ? 'status-critical' : undefined}
          disabled={isSubmitting || isLoading}
        />
      </Box>
      {message && <Text margin={{ top: 'small' }}>{message}</Text>}
    </Box>
  );
}