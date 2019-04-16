import { Robot, Response } from 'hubot';
import Axios from 'axios';
import { JSDOM } from 'jsdom';

module.exports = (robot: Robot<any>) => {

  robot.hear(/ボカヒト日報見て/, (response: Response<Robot<any>>) => {
    fetchMoviesURL().then(urls => { response.send(urls) }).catch(err => { response.send(err) });
  });

};

async function fetchMoviesURL(): Promise<string> {

  const urls =
    await Axios.get('http://cobachican.hatenadiary.jp/')
      .then(response => {
        const dom = new JSDOM(response.data);
        const out = dom.window.document.getElementsByTagName('iframe');
        if ( out !== null ) {
          const item = out.item(1);
          if ( item !== null ) {
            const src = item.getAttribute('src');
            if ( src !== null ) {
              const splited = src.split('/');
              return 'https://www.nicovideo.jp/watch/' + splited[ splited.length - 1 ];
            }
          }
        }
        return 'nothing...';
      })
      .catch(error => { return error });

  return urls;
}
