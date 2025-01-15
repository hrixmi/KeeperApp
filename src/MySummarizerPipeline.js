import { pipeline, TextStreamer } from '@huggingface/transformers';

class MySummarizerPipeline {
  static task = 'summarization';
  static model ='Xenova/distilbart-cnn-6-6';
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }

    return this.instance;
  }
}