import { app } from 'electron';
import { environment } from '../core/environment';
import { appDelegate } from './app-delegate';

process.on('uncaughtException', (error) => {
  appDelegate.preventQuit = true;

  console.error('Uncaught Exception: ', error.toString());

  if (error.stack) {
    console.error(error.stack);
  }
});

if (!environment.production) {
  app.commandLine.appendSwitch('remote-debugging-port', '9229');
}

app.once('ready', async () => {
  try {
    await appDelegate.run();
    console.log('START! 🤔');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
