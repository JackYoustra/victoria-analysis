import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import SaveViewer from "../routes/SaveViewer";

//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Buttons/Save Viewer',
  component: SaveViewer,
} as ComponentMeta<typeof SaveViewer>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof SaveViewer> = (args) => <SaveViewer {...args}/>;

export const FirstStory = Template.bind({});

const before = (offset: number): Date => {
  const current = new Date();
  current.setDate(current.getDate() - offset);
  return current;
}

FirstStory.args = {
  /*👇 The args you need here will depend on your component */
  saves: [["autosave.v2", new Date()], ["first.v2", before(1)], ["second.v2", before(2)], ["third.v2", before(3)]],
  selected: [1],
};