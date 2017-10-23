// MIT © 2017 azu

import { Polly } from "aws-sdk";

export function convertToPolly(text: string): Promise<Polly.Types.SynthesizeSpeechOutput> {
    const polly = new Polly({
        signatureVersion: "v4",
        region: "us-east-1"
    });

    const params = {
        Text: text,
        TextType: text.indexOf("<speak>") === -1 ? "text" : "ssml",
        OutputFormat: "mp3",
        VoiceId: "Mizuki" // Takumi
    };

    return new Promise((resolve, reject) => {
        polly.synthesizeSpeech(params, (err, data) => {
            if (err) {
                return reject(err);
            } else if (data) {
                resolve(data);
            }
        });
    });
}
