import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import {withReactContext} from "storybook-react-context";
import {VickySavesContext} from "../logic/VickySavesProvider";
import TopBar from "../routes/TopBar";
import {StoryRouter} from "storybook-react-router";

//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Views/TopBar',
  decorators: [
    withReactContext({
      Context: VickySavesContext,
      initialState: { state: { save: {}}  },
    }),
  ]
} as ComponentMeta<typeof TopBar>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof TopBar> = (args) => <TopBar />;

export const TopBarStory = Template.bind({});