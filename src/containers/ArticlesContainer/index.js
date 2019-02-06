import React from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

import { Article } from '../../components/Article';

const articles = [
  {
    id: 1,
    title: 'Music Created by Artificial Intelligence Is Better Than You Think',
    description: 'A.I. doesn’t have to be a threat to human musicians. It might actually improve their melodies.',
    url: 'https://medium.com/s/story/music-created-by-artificial-intelligence-is-better-than-you-think-ce73631e2ec5',
    sourceArticleId: 'ce73631e2ec5',
    sourceName: 'medium.com',
    authorName: 'Stuart Dredge',
    authorUrl: 'https://medium.com/@stuartdredge',
    categoryName: 'Artificial Intelligence',
    categoryUrl: 'https://medium.com/topic/artificial-intelligence',
    readingTimeInMinutes: 6.387106918238994,
    listenTimeInMinutes: 6.387106918238994,
    imageUrl: 'https://cdn-images-1.medium.com/focal/160/160/70/47/0*X46O6U6p3gB7Xj31'
  },
  {
    id: 2,
    title: 'The Extraordinary Power of Ordinary Thoughts',
    description: 'How to Transform Your Life by Transforming your Thoughts.',
    url: 'https://medium.com/swlh/the-extraordinary-power-of-ordinary-thoughts-538296d4ac62',
    sourceArticleId: '538296d4ac62',
    sourceName: 'medium.com',
    authorName: 'Matt Russell',
    authorUrl: 'https://medium.com/@Matt_Russell',
    categoryName: 'The Startup',
    categoryUrl: 'https://medium.com/swlh',
    readingTimeInMinutes: 7.033018867924528,
    listenTimeInMinutes: 7.033018867924528,
    imageUrl: 'https://cdn-images-1.medium.com/focal/160/160/70/47/1*L8mOAm2VcPJ-gUkOC1CzcA.jpeg'
  },
  {
    id: 3,
    title: 'A Conflict of Crypto Visions',
    description: 'Why do we fight? A framework suggests deeper reasons',
    url: 'https://medium.com/@arjunblj/a-conflict-of-crypto-visions-6f3e28066454',
    sourceArticleId: '6f3e28066454',
    sourceName: 'medium.com',
    authorName: 'Arjun Balaji',
    authorUrl: 'https://medium.com/@arjunblj',
    categoryName: 'Cryptocurrency',
    categoryUrl: 'https://medium.com/topic/cryptocurrency',
    readingTimeInMinutes: 22.41320754716981,
    listenTimeInMinutes: 22.41320754716981,
    imageUrl: 'https://cdn-images-1.medium.com/focal/160/160/70/47/1*MoFHboXxTGF5usbKPmc_mA.png'
  },
  {
    id: 4,
    title: 'You Win Some, You Lose Some: The Trials and Tribulations of a Freelancer',
    description: 'While it is easy to judge others how they should lead their lives, don’t forget that your own life needs some careful planning, too.',
    url: 'https://medium.com/the-post-grad-survival-guide/you-win-some-you-lose-some-the-trials-and-tribulations-of-a-freelancer-8be840f4752e',
    sourceArticleId: '8be840f4752e',
    sourceName: 'medium.com',
    authorName: 'Tessa Palmer',
    authorUrl: 'https://medium.com/@tessapalmer1',
    categoryName: 'The Post Grad Survival Guide',
    categoryUrl: 'https://medium.com/the-post-grad-survival-guide',
    readingTimeInMinutes: 3.557547169811321,
    listenTimeInMinutes: 3.557547169811321,
    imageUrl: 'https://cdn-images-1.medium.com/focal/160/160/70/47/0*mh2se6svsoVkCoGj'
  },
  {
    id: 5,
    title: 'Play Bitcoin: Remember, It’s Just a Game',
    description: 'Writer JP Koning on why bitcoin is more lottery than investment.',
    url: 'https://medium.com/s/the-crypto-collection/play-bitcoin-remember-its-just-a-game-jp-koning-lottery-investment-coinbase-6fd240297c93',
    sourceArticleId: '6fd240297c93',
    sourceName: 'medium.com',
    authorName: 'JP Koning',
    authorUrl: 'https://medium.com/@jp.koning',
    categoryName: 'Cryptocurrency',
    categoryUrl: 'https://medium.com/topic/cryptocurrency',
    readingTimeInMinutes: 5.830188679245283,
    listenTimeInMinutes: 5.830188679245283,
    imageUrl: 'https://cdn-images-1.medium.com/focal/160/160/70/47/1*6ob-aj0v-blUxULtjHXczw.jpeg'
  },
  {
    id: 6,
    title: 'How to Become a Better Software Developer',
    description: 'Today I would like to share some thoughts on ways a software developers can improve their professional skills and become better at their work. The topics raised here are universal and not specific to any technology stack.',
    url: 'https://medium.com/devtrailsio/how-to-become-a-better-software-developer-dd16072c974e',
    sourceArticleId: 'dd16072c974e',
    sourceName: 'medium.com',
    authorName: 'Pavels',
    authorUrl: 'https://medium.com/@pavelsj',
    categoryName: 'DevTrails',
    categoryUrl: 'https://medium.com/devtrailsio',
    readingTimeInMinutes: 14.256603773584905,
    listenTimeInMinutes: 14.256603773584905,
    imageUrl: 'https://cdn-images-1.medium.com/focal/160/160/70/47/0*qwohYdwnhpBRetPz'
  }
];
export class ArticlesContainer extends React.PureComponent {
  render() {

    return (
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => <Article article={item} />} />
    );
  }
}
