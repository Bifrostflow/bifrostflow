// 'use client';
import React from 'react';
import { Button } from '../button';
// import { useFormStatus } from 'react-dom';

export const SubmitProjectButton: React.FC = () => {
  //   const { pending } = useFormStatus();
  return (
    <Button type="submit">Create App</Button>
    // <Button disabled={pending} type="submit">
    //   {pending ? 'Loading...' : 'Create App'}
    // </Button>
  );
};
