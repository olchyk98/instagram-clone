// Imports
const tf = require('@tensorflow/tfjs')

const fs = require('fs');
const jpeg = require('jpeg-js');

// Polyfill
global.fetch = require('node-fetch');

// Load model

const CHANNELS = 3;

const readImage = path => {
    const buf = fs.readFileSync(path)
    const pixels = jpeg.decode(buf, true)
    return pixels;
}

const imageByteArray = (image, numChannels) => {
    const pixels = image.data
    const numPixels = image.width * image.height;
    const values = new Int32Array(numPixels * numChannels);

    for(let i = 0; i < numPixels; i++) {
        for(let channel = 0; channel < numChannels; ++channel) {
          values[i * numChannels + channel] = pixels[i * 4 + channel];
        }
    }

    return values;
}

const imageToInput = (image, numChannels) => {
    const values = imageByteArray(image, numChannels)
    const outShape = [image.height, image.width, numChannels];
    const input = tf.tensor3d(values, outShape, 'int32');

    return input;
}

const classify = async (model, path) => {
    const image = readImage(path);
    const input = imageToInput(image, CHANNELS);

    const predictions = await model.classify(input);

    return predictions;
}

module.exports = classify;
