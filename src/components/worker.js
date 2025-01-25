import { pipeline, env } from '@xenova/transformers';

// Configure environment
env.localModelPath = undefined;
env.allowRemoteModels = true;
env.backends.onnx.wasm.numThreads = 1;

class MySummarizerPipeline {
  static task = 'summarization';
  static model = 'facebook/bart-large-cnn';
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      try {
        // Send initiate message
        self.postMessage({ 
          status: 'initiate',
          message: 'Starting model download...'
        });
        
        // Initialize the pipeline with detailed progress reporting
        this.instance = await pipeline(this.task, this.model, { 
          progress_callback: (progress) => {
            console.log('Loading progress:', progress);
            self.postMessage({ 
              status: 'progress',
              progress: progress,
              message: `Downloading model: ${Math.round(progress.progress * 100)}%`
            });
          },
          quantized: true,
        });
        
        // Send ready message
        self.postMessage({ 
          status: 'ready',
          message: 'Model loaded successfully!'
        });
      } catch (err) {
        console.error('Detailed error:', err);
        self.postMessage({ 
          status: 'error', 
          error: `Model loading failed: ${err.message}`,
          details: err.stack
        });
        throw err;
      }
    }
    return this.instance;
  }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
  try {
    console.log('Worker received message:', event.data);
    
    // Get the pipeline instance
    let summarizer = await MySummarizerPipeline.getInstance();

    if (!summarizer) {
      throw new Error('Summarizer initialization failed');
    }

    // Generate the summary
    const output = await summarizer(event.data.text, {
      max_length: 100,
      min_length: 30,
      callback_function: partial_output => {
        self.postMessage({
          status: 'update',
          output: partial_output
        });
      }
    });

    // Send the final result
    self.postMessage({
      status: 'complete',
      output: output[0].summary_text
    });
  } catch (err) {
    console.error('Worker error:', err);
    self.postMessage({
      status: 'error',
      error: err.message,
      details: err.stack
    });
  }
});

// Add error handler for uncaught errors
self.addEventListener('error', (error) => {
  console.error('Worker global error:', error);
  self.postMessage({
    status: 'error',
    error: 'Uncaught worker error',
    details: error.message
  });
});

// Add unhandled rejection handler
self.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  self.postMessage({
    status: 'error',
    error: 'Unhandled promise rejection',
    details: event.reason
  });
});
