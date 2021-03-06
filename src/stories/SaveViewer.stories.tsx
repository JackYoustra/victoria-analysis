import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import SaveViewer from "../routes/SaveViewer";

//π This default export determines where your story goes in the story list
export default {
  /* π The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Buttons/Save Viewer',
  component: SaveViewer,
} as ComponentMeta<typeof SaveViewer>;

//π We create a βtemplateβ of how args map to rendering
const Template: ComponentStory<typeof SaveViewer> = (args) => <SaveViewer {...args}/>;

export const PopulatedList = Template.bind({});

const before = (offset: number): Date => {
  const current = new Date();
  current.setDate(current.getDate() - offset);
  return current;
}

PopulatedList.args = {
  /*π The args you need here will depend on your component */
  loading: true,
  saves: [["autosave.v2", new Date()], ["first.v2", before(1)], ["second.v2", before(2)], ["third.v2", before(3)]],
  selected: [1],
};