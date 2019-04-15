import { Robot, Response } from 'hubot';

module.exports = (robot: Robot<any>): void => {

    robot.hear(/aa/, (msg: Response<Robot<any>>) => {
        msg.send('A', 'B');
    });

    robot.respond(/say-hw/, (msg: Response<Robot<any>>) => {
        msg.reply('Hello, World');
        msg.reply('What is this...');
    });
};
