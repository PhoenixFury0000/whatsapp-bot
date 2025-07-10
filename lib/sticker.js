const webp = require('node-webpmux');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { tmpdir } = require('os');
const crypto = require('crypto');
const path = require('path');
ffmpeg.setFfmpegPath(require('@ffmpeg-installer/ffmpeg').path);

class StickerBuilder {
  constructor() {
    this.tmp = tmpdir();
  }

  _tmp(ext) {
    return path.join(this.tmp, `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.${ext}`);
  }

  async toSticker(type, media, exif = null) {
    const ext = type === 'image' ? 'jpg' : 'mp4';
    const input = this._tmp(ext);
    const output = this._tmp('webp');

    fs.writeFileSync(input, media);

    await new Promise((resolve, reject) => {
      ffmpeg(input)
        .on('error', reject)
        .on('end', () => resolve(true))
        .addOutputOptions(
          ext === 'jpg'
            ? [
                '-vcodec',
                'libwebp',
                '-vf',
                "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse"
              ]
            : [
                '-vcodec',
                'libwebp',
                '-vf',
                "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse",
                '-loop', '0',
                '-ss', '00:00:00',
                '-t', '00:00:05',
                '-preset', 'default',
                '-an',
                '-vsync', '0'
              ]
        )
        .toFormat('webp')
        .save(output);
    });

    const buffer = fs.readFileSync(output);
    fs.unlinkSync(input);
    fs.unlinkSync(output);

    return exif ? await this.addExif(buffer, exif) : buffer;
  }

  async addExif(webpSticker, info) {
    const img = new webp.Image();
    const { packname, author, categories } = info;

    const json = {
      'sticker-pack-id': [...Array(32)].map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(''),
      'sticker-pack-name': packname || '',
      'sticker-pack-publisher': author || '',
      'emojis': categories || ['💖'],
      'android-app-store-link': 'https://github.com/naxordeve/whatsapp-bot',
      'ios-app-store-link': 'https://github.com/naxordeve/whatsapp-bot'
    };

    const exifAttr = Buffer.from([
      0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x16, 0x00, 0x00, 0x00
    ]);

    const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
    const exif = Buffer.concat([exifAttr, jsonBuffer]);
    exif.writeUIntLE(jsonBuffer.length, 14, 4);

    await img.load(webpSticker);
    img.exif = exif;
    return await img.save(null);
  }

  async getExif(sticker) {
    const img = new webp.Image();
    await img.load(sticker);
    const json = JSON.parse(
      img.exif
        .slice(22)
        .toString()
        .replace('sticker-pack-name', 'sticker_pack_name')
        .replace('sticker-pack-publisher', 'sticker_pack_publisher')
    );
    return {
      packname: json.sticker_pack_name,
      author: json.sticker_pack_publisher
    };
  }
}

module.exports = new StickerBuilder();
