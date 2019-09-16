import { app } from 'electron';
import { environment } from '../core/environment';
import { geeksGrass } from './geeks-grass';

process.on('uncaughtException', (error) => {
  geeksGrass.preventQuit = true;

  console.error('Uncaught Exception: ', error.toString());

  if (error.stack) {
    console.error(error.stack);
  }
});

if (!environment.production) {
  app.commandLine.appendSwitch('remote-debugging-port', '9229');
}

// app.dock.hide();

app.once('ready', async () => {
  try {
    await geeksGrass.run();
    console.log('Git grass! 🌱');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
