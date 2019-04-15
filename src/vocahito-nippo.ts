import { Robot, Response } from 'hubot';
import Axios from 'axios';

module.exports = (robot: Robot<any>) => {

  robot.hear(/ボカヒト日報見て/, (response: Response<Robot<any>>) => {
    fetchMoviesURL().then(urls => { response.send(urls) }).catch(err => { response.send(err) });
  });

};

async function fetchMoviesURL(): Promise<string> {

  const urls =
    await Axios.get('http://cobachican.hatenadiary.jp/')
      .then(response => {
        return response.data;
      })
      .catch(error => { return error });

  return urls;
}
