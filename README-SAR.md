# FFmpeg/FFprobe Lambda Layer for Amazon Linux 2023 AMIs

Static build of FFmpeg/FFprobe for Amazon Linux 2023, packaged as a Lambda layer. Bundles FFmpeg 7.0.2.

This application provides a single output, `LayerVersion`, which points to a
Lambda Layer ARN you can use with Lambda runtimes based on Amazon Linux 2023 (such
as the `nodejs22.x` runtime).

For an example of how to use the layer, check out 
<https://github.com/serverlesspub/ffmpeg-aws-lambda-layer/tree/master/example>
