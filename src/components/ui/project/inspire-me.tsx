'use client';
import React, { useState } from 'react';
import { Button } from '../button';
import Drawer from '../drawer';
import { Typography } from '../typography';

const InspireMe = () => {
  const [showInspireModal, setShowInspireModal] = useState(false);
  return (
    <>
      <Button
        variant={'secondary'}
        className="fixed right-36"
        onClick={() => {
          setShowInspireModal(true);
        }}>
        Motivate Me
      </Button>
      <Drawer
        className="w-[400px] top-32 right-5"
        onClose={() => setShowInspireModal(false)}
        visible={showInspireModal}
        position="right">
        <Typography className="text-center text-2xl font-bold mb-4">
          Motivate Me
        </Typography>
        <Typography className="text-center mb-6">
          Motivate me by selective this option. I will get a random project idea
          to work on. Thanks!
        </Typography>
        <ul className="list-disc pl-6 text-c-background-text mb-4">
          <li className="mb-2">
            <Typography className="text-lg">1. Random Project Idea</Typography>
          </li>
          <li className="mb-2">
            <Typography className="text-lg">2. New Challenges</Typography>
          </li>
          <li className="mb-2">
            <Typography className="text-lg">
              3. Explore New Technologies
            </Typography>
          </li>
          <li className="mb-2">
            <Typography className="text-lg">4. Enhance Skills</Typography>
          </li>
        </ul>
        <Button
          variant={'secondary'}
          className="w-full"
          onClick={() => {
            // Here you can implement the logic to fetch a random project idea
            // For now, we will just close the modal
            setShowInspireModal(false);
          }}>
          Vote
        </Button>
      </Drawer>
    </>
  );
};

export default InspireMe;
