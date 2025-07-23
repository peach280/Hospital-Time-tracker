'use client';

import { useState, useEffect } from 'react';
import { Box, Button, DataTable, Grid, Heading, Text, TextInput,Table, TableHeader,TableRow,TableCell,TableBody } from 'grommet';
import { useAuth0 } from '@auth0/auth0-react';
import LocationDisplay from './locationdisplay';


// Column definitions for the tables
const clockedInColumns = [
  { property: 'name', header: <Text>Name</Text>, render: (datum) => datum.user.name },
  { property: 'clockInTime', header: 'Clock In Time', render: (datum) => new Date(datum.clockInTime).toLocaleTimeString() },
  { property: 'clockInNote', header: 'Note' },
];

const historyColumns = [
    { property: 'name', header: <Text>Name</Text>, render: (datum) => datum.user.name },
    { property: 'clockInTime', header: 'Clocked In', render: (datum) => new Date(datum.clockInTime).toLocaleString() },
    { 
      property: 'clockInLocation', 
      header: 'Clock In Location', 
      render: (datum) => <LocationDisplay lat={datum.clockInLat} lng={datum.clockInLng} />
    },
    { property: 'clockOutTime', header: 'Clocked Out', render: (datum) => datum.clockOutTime ? new Date(datum.clockOutTime).toLocaleString() : 'Active' },
    { 
      property: 'clockOutLocation', 
      header: 'Clock Out Location', 
      render: (datum) => datum.clockOutLat ? <LocationDisplay lat={datum.clockOutLat} lng={datum.clockOutLng} /> : '-'
    }
];

export default function ManagerPage() {
  const { user } = useAuth0();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [address, setAddress] = useState('Indore, Madhya Pradesh');
  const [radiusKm, setRadiusKm] = useState(2);
  const [perimeterMessage, setPerimeterMessage] = useState('');

  
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/shifts');
        if (!res.ok) throw new Error('Failed to fetch dashboard data.');
        const data = await res.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSetPerimeter = async () => {
    if (!user) {
      setPerimeterMessage('You must be logged in.');
      return;
    }
    setPerimeterMessage('Saving...');
    try {
      const geoRes = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      if (!geoRes.ok) throw new Error('Failed to find location.');
      const { lat, lng } = await geoRes.json();
      
      setPerimeterMessage('Saving perimeter...');
      
      const perimRes = await fetch('/api/perimeter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ managerId: user.sub, lat, lng, radiusKm: parseFloat(radiusKm) }),
      });

      if (perimRes.ok) {
        setPerimeterMessage('Perimeter saved successfully!');
      } else {
        throw new Error('Failed to save perimeter.');
      }
    } catch (err) {
      setPerimeterMessage(err.message);
    }
  };

  if (isLoading) return <Box pad="large"><Text>Loading dashboard...</Text></Box>;
  if (error) return <Box pad="large"><Text color="status-critical">{error}</Text></Box>;
  if (!dashboardData) return <Box pad="large"><Text>No data available.</Text></Box>;

  const { shifts, currentlyClockedIn, analytics } = dashboardData;
  return (
    <Box pad="large" gap="large">
      <Heading level="2">Manager Dashboard</Heading>

      {/* Analytics Section */}
      <Box>
        <Heading level="3">Analytics (Last 7 Days)</Heading>
        <Grid columns="small" gap="medium">
          <Box pad="medium" background="light-2" round="small">
            <Text size="large" weight="bold">{analytics.avgHours}</Text>
            <Text>Avg. hours per shift</Text>
          </Box>
          <Box pad="medium" background="light-2" round="small">
            <Text size="large" weight="bold">{Object.keys(analytics.perDayCounts).length > 0 ? analytics.perDayCounts[new Date().toISOString().split('T')[0]] || 0 : 0}</Text>
            <Text>Number of people Clocked-in today</Text>
          </Box>
        </Grid>
        <Heading level={4} margin={{ top: 'medium' }}>Total Hours Per Staff</Heading>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell scope="col"><Text weight="bold">Staff</Text></TableCell>
                <TableCell scope="col"><Text weight="bold">Total Hours</Text></TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(analytics.totals).map(([name, hours]) => (
                <TableRow key={name}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{hours.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </Box>

      {/*Perimeter Section */}
      <Box gap="small">
        <Heading level="3">Set Clock-In Perimeter</Heading>
        <Box direction="row" gap="medium" align="center">
          <Box width="medium">
            <TextInput 
              placeholder="Enter address or location" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
            />
          </Box>
          <Text>within</Text>
          <Box width="small">
            <TextInput 
              type="number" 
              value={radiusKm} 
              onChange={(e) => setRadiusKm(e.target.value)} 
            />
          </Box>
          <Text>km</Text>
          <Button label="Set Perimeter" onClick={handleSetPerimeter} primary />
        </Box>
        {perimeterMessage && <Text size="small">{perimeterMessage}</Text>}
      </Box>

      {/* Currently Clocked-In Table */}
      <Box>
        <Heading level="3">Currently Clocked-In Staff</Heading>
        <DataTable columns={clockedInColumns} data={currentlyClockedIn} />
      </Box>

      {/* Staff History Table */}
      <Box>
        <Heading level="3">Recent Staff History (Last 7 Days)</Heading>
        <DataTable columns={historyColumns} data={shifts} step={10} paginate />
      </Box>
    </Box>
  );
}