import { Robot } from 'hubot';
import Axios from 'axios';
import { JSDOM } from 'jsdom';
import * as cron from 'node-cron';

interface Log {
  error(message: string): void;
}

declare module 'hubot' {

  type Envelope = {
    /* room is channelID. 
     * How to get discord channelID -> 
     * https://github.com/Chikachi/DiscordIntegration/wiki/How-to-get-a-token-and-channel-ID-for-Discord
     */
    room: string
  };

  interface Robot<A> {

    logger: Log;

    send(envelope: Envelope, ...strings: string[]): void;

  }

}

module.exports = (robot: Robot<any>) => {
  const channelID = process.env.DISCORD_CHANNEL_ID;
  if ( channelID !== undefined ) {
    cron.schedule('00 12 00 * * *', () => {
      fetchMoviesURL()
        .then(urls => {
          if ( urls.length === 0 ) {
            robot.send({ room: channelID }, '本日のボカロ曲はないみたいですね・・・。');
          } else {
            robot.send({ room: channelID }, urls);
          }
        })
        .catch(err => { robot.send({ room: channelID }, err) });
    });
  } else {
    robot.logger.error('環境変数 DISCORD_CHANNEL_ID が設定されていないので、botを動作させられません.');
  }
};

async function fetchMoviesURL(): Promise<string> {
  const urls =
    await Axios.get('http://cobachican.hatenadiary.jp/')
      .then(response => {
        const dom      = new JSDOM(response.data);
        const articles = dom.window.document.querySelectorAll('article');
        if ( articles !== null ) {
          const iframes = articles.item(0).querySelectorAll('iframe');
          return Array.prototype.map.apply(iframes, [(iframe: HTMLElement) => {
            const src = iframe.getAttribute('src');
            if ( src !== null ) {
              const splited = src.split('/');
              return 'https://www.nicovideo.jp/watch/' + splited[ splited.length - 1 ];
            } else {
              return 'Parse error ocured.';
            }
          }]).join("\n");
        } else {
          return 'There are no articles.'
        }
      })
      .catch(error => { return error });
  return urls;
}
