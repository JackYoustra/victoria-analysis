import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import {VickyButton, VickyMinorButton} from "../components/VickyButton";

//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Buttons/Victoria Button',
  component: VickyButton,
} as ComponentMeta<typeof VickyButton>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof VickyButton> = (args) => <VickyButton {...args}> {args.label} </VickyButton>;
const Small: ComponentStory<typeof VickyMinorButton> = (args) => <VickyMinorButton {...args}> {args.label} </VickyMinorButton>;

export const FirstStory = Template.bind({});
export const SmallStory = Small.bind({});

FirstStory.args = {
  /*👇 The args you need here will depend on your component */
  label: 'Vicky Button',
};

SmallStory.args = {
  label: 'Vicky Button',
};