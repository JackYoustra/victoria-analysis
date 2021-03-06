import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import {VickyButton, VickyMinorButton} from "../components/VickyButton";

//π This default export determines where your story goes in the story list
export default {
  /* π The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Buttons/Victoria Button',
  component: VickyButton,
} as ComponentMeta<typeof VickyButton>;

//π We create a βtemplateβ of how args map to rendering
const Template: ComponentStory<typeof VickyButton> = (args) => <VickyButton {...args}> {args.label} </VickyButton>;
const SmallButton: ComponentStory<typeof VickyMinorButton> = (args) => <VickyMinorButton {...args}> {args.label} </VickyMinorButton>;

export const Normal = Template.bind({});
export const Small = SmallButton.bind({});

Normal.args = {
  /*π The args you need here will depend on your component */
  label: 'Vicky Button',
};

Small.args = {
  label: 'Vicky Button',
};