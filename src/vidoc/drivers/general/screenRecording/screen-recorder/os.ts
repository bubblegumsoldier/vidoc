import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import * as win from './winInfo';

import { Util } from './util';

const exists = util.promisify(fs.exists);

export class OSUtil {

  static async findFileOnPath(name: string, extra: string[] = []) {
    const paths = (process.env.PATH || '')
      .split(path.delimiter)
      .map(x => path.resolve(x, name));

    paths.unshift(...extra);

    for (const p of paths) {
      if (await exists(p)) {
        return p;
      }
    }
    
    throw new Error(`Cannot find ${name} on path`);
  }

  static async openFile(file: string) {
    let cmd: string;
    const args: string[] = [`file://${file.replace(/[\\/]+/g, '/')}`];
    if (process.platform === 'darwin') {
      cmd = 'open';
    } else if (process.platform === 'win32') {
      cmd = 'cmd';
      args.unshift('/c', 'start');
    } else {
      cmd = 'xdg-open';
    }
    await Util.processToPromise(cmd, args);
  }

  static async getWindow(pid?: number) {
    const info = await (pid ? win.getByPid(pid) : win.getActive());
    const b = info.bounds!;

    if (process.platform !== 'darwin') {
      if (process.platform === 'win32') {
        const multiplier = info.screens[0].scale.x;
        b.width = Math.trunc(b.width * multiplier);
        b.height = Math.trunc(b.height * multiplier);
        b.x = Math.trunc(b.x * multiplier);
        b.y = Math.trunc(b.y * multiplier);
      }
      b.width += (b.width % 2);
      b.height += (b.height % 2);
      b.x -= (b.x % 2);
      b.y -= (b.y % 2);
    }

    return info!;
  }

  static async getMacInputDevices(ffmpegBinary: string, window: win.Response, audio = false) {
    const { stderr: text } = await Util.processToStd(ffmpegBinary, ['-f', 'avfoundation', '-list_devices', 'true', '-i', '""']);
    const matched: string[] = [];
    text.replace(/\[(\d+)\]\s+Capture\s+screen/ig, (all, index: string) => {
      matched.push(index);
      return '';
    });

    const matchedIndex = matched[window.screens[0].index];

    if (matchedIndex === undefined) {
      throw new Error('Cannot find screen recording device');
    }
    const videoIndex = matchedIndex.toString();
    let audioIndex = 'none';
    if (audio) {
      const matchedAudioIndex = /\[(\d+)\]\s+[^\n]*Microphone/ig.exec(text);
      if (!matchedAudioIndex) {
        throw new Error('Cannot find microphone recording device');
      }
      audioIndex = matchedAudioIndex[1].toString();
    }
    return { video: videoIndex, audio: audioIndex };
  }

  static async getMacAudioDevices(ffmpegBinary: string) {
    let text;
    try {
      // Use 'avfoundation' for macOS instead of 'dshow' for Windows
      const { stderr } = await Util.processToStd(ffmpegBinary, ['-f', 'avfoundation', '-list_devices', 'true', '-i', '\"\"']);
      text = stderr;
    } catch (e) {
      throw e;
    }
    console.log(text);
    const audioDevicesOnlyText = text.split('audio devices')[1];
  
    // Adjust the regular expression to match the macOS output
    const regex = /\[AVFoundation [a-zA-Z\s]+ @ [\w]+\]\s\[(\d+)\]\s(.+)?/g;
  
    const textLines = audioDevicesOnlyText.split('\n');
    const foundDevices: string[] = [];
  
    let match;
    for (const line of textLines) {
      while ((match = regex.exec(line)) !== null) {
        const matchingGroup = match[2]; // Group 2 captures the actual device name
        foundDevices.push(matchingGroup);
      }
    }
  
    return foundDevices;
  }
  

  static async getWinAudioDevices(ffmpegBinary: string) {
    let text;
    try {
      const { stderr } = await Util.processToStd(ffmpegBinary, ['-f', 'dshow', '-list_devices', 'true', '-i', 'dummy']);
      text = stderr;
    } catch(e) {
      throw e;
    }
    console.log(text);
    const regex = /\"(.+)\"\s\(audio\)/g;
    const textLines = text.split('\n');
    const out: { audio?: string, video?: string } = {};

    let match;
    const foundDevices = [];
    for(const line of textLines) {
      while ((match = regex.exec(line)) !== null) {
        const matchingGroup = match[1]; // Group 1 captures the actual device name
        const start = match.index;
        const end = start + match[0].length;
        foundDevices.push(matchingGroup);
      }
    }
    return foundDevices;
  }

  static async getWinDevices(ffmpegBinary: string, audio = false) {
    let text;
    try {
      const { stderr } = await Util.processToStd(ffmpegBinary, ['-f', 'dshow', '-list_devices', 'true', '-i', 'dummy']);
      text = stderr;
    } catch(e) {
      throw e;
    }
    console.log(text);
    const regex = /\"(.+)\"\s\(audio\)/g;
    const textLines = text.split('\n');
    const out: { audio?: string, video?: string } = {};

    let match;
    const foundDevices = [];
    for(const line of textLines) {
      while ((match = regex.exec(line)) !== null) {
        const matchingGroup = match[1]; // Group 1 captures the actual device name
        const start = match.index;
        const end = start + match[0].length;
        foundDevices.push(matchingGroup);
      }
    }

    if (audio) {
      if (foundDevices.length <= 0) {
        throw new Error('Cannot find microphone recording device');
      } else {
        out.audio = foundDevices[0].toString();
        console.log(out.audio);
      }
    }
    return out;
  }
}