import React, {useLayoutEffect, useState} from 'react';

import { Router, Route, Routes } from 'react-router-dom'

import { ComponentStory, ComponentMeta } from '@storybook/react';

import {withReactContext} from "storybook-react-context";
import {VickySavesContext} from "../logic/VickySavesProvider";
import TopBar from "../routes/TopBar";
import {createMemoryHistory} from "history";

//@ts-ignore
const CustomRouter = ({ history, ...props }) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      {...props}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
};

//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Buttons/TopBar',
  component: TopBar,
  decorators: [
    withReactContext({
      Context: VickySavesContext,
      initialState: { state: { save: {}}  },
    }),
    story => (
      <CustomRouter history={createMemoryHistory({ initialEntries: ['/'] })}>
        <Routes>
          <Route path="/" element={ story() } />
        </Routes>
      </CustomRouter>
    ),
  ]
} as ComponentMeta<typeof TopBar>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof TopBar> = (args) => <TopBar />;

export const TopBarStory = Template.bind({});

TopBarStory.args = {
  label: 'Top Menu Bar',
};