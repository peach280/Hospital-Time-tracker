'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, Heading, Text } from 'grommet';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  const { user, isLoading, loginWithRedirect, logout } = useAuth0();

  useEffect(() => {
    if (user) {
      fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      });
    }
  }, [user]);

  if (isLoading) {
    return <Box pad="large"><Text>Loading...</Text></Box>;
  }

  if (user) {
    const userRole = user['http://localhost:3000/role'];
    console.log(userRole)

    return (
      <Box pad="large" gap="medium" align="center">
        <Heading>Welcome, {user.nickname}!</Heading>

        {userRole === 'MANAGER' && (
          <Link href="/manager"><Button label="Go to Manager Page" /></Link>
        )}

       
        {userRole === 'CARE_WORKER' && (
          <Link href="/care-worker"><Button label="Go to Care Worker Page" /></Link>
        )}
       

        <Button
          label="Logout"
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        />
      </Box>
    );
  }

  return (
    <Box fill align="center" justify="center">
      <Heading>Welcome to Lief Time Tracker</Heading>
      <Button label="Login" onClick={() => loginWithRedirect()} />
    </Box>
  );
}
